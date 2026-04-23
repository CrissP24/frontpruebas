// Fixes Latin-1 mojibake — UTF-8 bytes misread as Latin-1.
// Example: "CaÃ±arte" → "Cañarte"
function fixMojibake(str) {
  if (!str || typeof str !== 'string') return str
  try {
    const bytes = new Uint8Array(str.length)
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i)
      if (code > 255) return str
      bytes[i] = code
    }
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    return str
  }
}

// "Apellido1 Apellido2 Nombre" (3+ words) → "Nombre Apellido1"
// "Nombre Apellido" (2 words) → unchanged
function normalizeName(name) {
  if (!name) return name
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length <= 2) return words.join(' ')
  return `${words[words.length - 1]} ${words[0]}`
}

// Try to recover the full original name from mysimo_users, which may not have
// been truncated by earlier versions of this code.
function getFullNameFromUsers(userId) {
  try {
    const raw = localStorage.getItem('mysimo_users')
    if (!raw) return null
    const users = JSON.parse(raw)
    const user = users.find(u => u.id == userId)
    return user?.name || null
  } catch {
    return null
  }
}

export function getAuth() {
  try {
    const raw = localStorage.getItem('mysimo_auth')
    if (!raw) return null
    const auth = JSON.parse(raw)
    if (!auth?.user) return null

    // Google users: if stored name looks potentially wrong (≤ 2 words),
    // cross-reference mysimo_users which might have the original 3-word name.
    let sourceName = auth.user.name
    if (auth.user.googleId) {
      const fullName = getFullNameFromUsers(auth.user.id)
      if (fullName) sourceName = fullName
    }

    const fixedName = normalizeName(fixMojibake(sourceName))
    const fixedEmail = fixMojibake(auth.user.email)

    const fixed = {
      ...auth,
      user: { ...auth.user, name: fixedName, email: fixedEmail },
    }

    // Persist corrected values back so mysimo_users and mysimo_auth are in sync
    if (auth.user.name !== fixedName || auth.user.email !== fixedEmail) {
      localStorage.setItem('mysimo_auth', JSON.stringify(fixed))
      // Also update the name in mysimo_users
      try {
        const usersRaw = localStorage.getItem('mysimo_users')
        if (usersRaw) {
          const users = JSON.parse(usersRaw)
          const idx = users.findIndex(u => u.id == auth.user.id)
          if (idx !== -1) {
            users[idx] = { ...users[idx], name: fixedName }
            localStorage.setItem('mysimo_users', JSON.stringify(users))
          }
        }
      } catch { /* ignore */ }
    }

    return fixed
  } catch {
    return null
  }
}

export function setAuth(auth) {
  localStorage.setItem('mysimo_auth', JSON.stringify(auth))
}

export function clearAuth() {
  localStorage.removeItem('mysimo_auth')
}
