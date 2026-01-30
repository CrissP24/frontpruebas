// Mock data for MVP - all stored in localStorage

// Initial mock data
const initialUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@mysimo.ec',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Dr. Juan Pérez',
    email: 'juan.perez@doctor.com',
    role: 'doctor',
    avatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=10b981&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'María García',
    email: 'maria.garcia@paciente.com',
    role: 'patient',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=f59e0b&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Dra. Ana López',
    email: 'ana.lopez@doctor.com',
    role: 'doctor',
    avatar: 'https://ui-avatars.com/api/?name=Ana+Lopez&background=ef4444&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Dr. Carlos Rodríguez',
    email: 'carlos.rodriguez@doctor.com',
    role: 'doctor',
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=8b5cf6&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 6,
    name: 'Dr. Laura Martínez',
    email: 'laura.martinez@doctor.com',
    role: 'doctor',
    avatar: 'https://ui-avatars.com/api/?name=Laura+Martinez&background=06b6d4&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 7,
    name: 'Roberto Sánchez',
    email: 'roberto.sanchez@paciente.com',
    role: 'patient',
    avatar: 'https://ui-avatars.com/api/?name=Roberto+Sanchez&background=84cc16&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 8,
    name: 'Carmen Díaz',
    email: 'carmen.diaz@paciente.com',
    role: 'patient',
    avatar: 'https://ui-avatars.com/api/?name=Carmen+Diaz&background=f97316&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 9,
    name: 'Dr. Roberto García',
    email: 'roberto.garcia@doctor.com',
    role: 'doctor',
    specialty: 'Medicina Interna',
    province: 'Guayas',
    city: 'Guayaquil',
    phone: '+593 987654325',
    insurances: ['IESS', 'Seguros del Ecuador'],
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Roberto+Garcia&background=14b8a6&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 10,
    name: 'Dra. María Fernández',
    email: 'maria.fernandez@doctor.com',
    role: 'doctor',
    specialty: 'Oftalmología',
    province: 'Pichincha',
    city: 'Quito',
    phone: '+593 987654326',
    insurances: ['IESS', 'Qualitas'],
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Fernandez&background=f59e0b&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 11,
    name: 'Dr. Andrés Morales',
    email: 'andres.morales@doctor.com',
    role: 'doctor',
    specialty: 'Ortopedia',
    province: 'Azuay',
    city: 'Cuenca',
    phone: '+593 987654327',
    insurances: ['Seguros del Ecuador', 'Pacífico Salud'],
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Andres+Morales&background=dc2626&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 12,
    name: 'Dra. Patricia Ruiz',
    email: 'patricia.ruiz@doctor.com',
    role: 'doctor',
    specialty: 'Psiquiatría',
    province: 'Manabí',
    city: 'Portoviejo',
    phone: '+593 987654328',
    insurances: ['IESS'],
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Patricia+Ruiz&background=7c3aed&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 13,
    name: 'Dr. Eduardo Vargas',
    email: 'eduardo.vargas@doctor.com',
    role: 'doctor',
    specialty: 'Urología',
    province: 'Guayas',
    city: 'Guayaquil',
    phone: '+593 987654329',
    insurances: ['IESS', 'Seguros del Ecuador'],
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Eduardo+Vargas&background=059669&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 14,
    name: 'Dra. Sofía Castro',
    email: 'sofia.castro@doctor.com',
    role: 'doctor',
    specialty: 'Neurología',
    province: 'Pichincha',
    city: 'Quito',
    phone: '+593 987654330',
    insurances: ['IESS', 'Qualitas'],
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Sofia+Castro&background=ea580c&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 15,
    name: 'Dr. Miguel Torres',
    email: 'miguel.torres@doctor.com',
    role: 'doctor',
    specialty: 'Cirugía General',
    province: 'Tungurahua',
    city: 'Ambato',
    phone: '+593 987654331',
    insurances: ['IESS', 'Seguros del Ecuador'],
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Miguel+Torres&background=0891b2&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 16,
    name: 'Dra. Carolina Mendoza',
    email: 'carolina.mendoza@doctor.com',
    role: 'doctor',
    specialty: 'Endocrinología',
    province: 'Loja',
    city: 'Loja',
    phone: '+593 987654332',
    insurances: ['IESS'],
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Carolina+Mendoza&background=d97706&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 17,
    name: 'Dr. Fernando Herrera',
    email: 'fernando.herrera@doctor.com',
    role: 'doctor',
    specialty: 'Radiología',
    province: 'Pichincha',
    city: 'Quito',
    phone: '+593 987654333',
    insurances: ['IESS', 'Qualitas'],
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Fernando+Herrera&background=7c2d12&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 18,
    name: 'Luis Martínez',
    email: 'luis.martinez@paciente.com',
    role: 'patient',
    avatar: 'https://ui-avatars.com/api/?name=Luis+Martinez&background=06b6d4&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 19,
    name: 'Ana Torres',
    email: 'ana.torres@paciente.com',
    role: 'patient',
    avatar: 'https://ui-avatars.com/api/?name=Ana+Torres&background=8b5cf6&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 20,
    name: 'Jorge Ramírez',
    email: 'jorge.ramirez@paciente.com',
    role: 'patient',
    avatar: 'https://ui-avatars.com/api/?name=Jorge+Ramirez&background=10b981&color=fff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const initialDoctors = [
  {
    id: 2,
    full_name: 'Dr. Juan Pérez',
    specialtyId: 1,
    specialty: 'Cardiología',
    province: 'Pichincha',
    city: 'Quito',
    phone: '+593 987654321',
    email: 'juan.perez@doctor.com',
    insurances: ['IESS', 'Seguros del Ecuador'],
    status: 'active',
    rating: 4.5,
    reviews_count: 12,
    avatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=10b981&color=fff',
    bio: 'Cardiólogo con más de 15 años de experiencia en el tratamiento de enfermedades cardiovasculares.',
    experience_years: 15,
    consultation_fee: 80,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    full_name: 'Dra. Ana López',
    specialtyId: 2,
    specialty: 'Pediatría',
    province: 'Guayas',
    city: 'Guayaquil',
    phone: '+593 987654322',
    email: 'ana.lopez@doctor.com',
    insurances: ['IESS'],
    status: 'active',
    rating: 4.8,
    reviews_count: 25,
    avatar: 'https://ui-avatars.com/api/?name=Ana+Lopez&background=ef4444&color=fff',
    bio: 'Pediatra especializada en el cuidado integral de niños y adolescentes.',
    experience_years: 12,
    consultation_fee: 70,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    full_name: 'Dr. Carlos Rodríguez',
    specialtyId: 3,
    specialty: 'Dermatología',
    province: 'Azuay',
    city: 'Cuenca',
    phone: '+593 987654323',
    email: 'carlos.rodriguez@doctor.com',
    insurances: ['Seguros del Ecuador', 'Pacífico Salud'],
    status: 'pending', // Pending approval
    rating: 0,
    reviews_count: 0,
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=8b5cf6&color=fff',
    bio: 'Dermatólogo con especialización en tratamientos estéticos y enfermedades de la piel.',
    experience_years: 8,
    consultation_fee: 90,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 6,
    full_name: 'Dr. Laura Martínez',
    specialtyId: 4,
    specialty: 'Ginecología',
    province: 'Pichincha',
    city: 'Quito',
    phone: '+593 987654324',
    email: 'laura.martinez@doctor.com',
    insurances: ['IESS', 'Qualitas'],
    status: 'active',
    rating: 4.7,
    reviews_count: 18,
    avatar: 'https://ui-avatars.com/api/?name=Laura+Martinez&background=06b6d4&color=fff',
    bio: 'Ginecóloga obstetra con amplia experiencia en atención prenatal y ginecológica.',
    experience_years: 14,
    consultation_fee: 85,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 7,
    full_name: 'Dr. Roberto García',
    specialty: 'Medicina Interna',
    province: 'Guayas',
    city: 'Guayaquil',
    phone: '+593 987654325',
    email: 'roberto.garcia@doctor.com',
    insurances: ['IESS', 'Seguros del Ecuador'],
    status: 'active',
    rating: 4.6,
    reviews_count: 20,
    avatar: 'https://ui-avatars.com/api/?name=Roberto+Garcia&background=14b8a6&color=fff',
    bio: 'Médico internista con enfoque en enfermedades crónicas y preventivas.',
    experience_years: 18,
    consultation_fee: 75,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 8,
    full_name: 'Dra. María Fernández',
    specialty: 'Oftalmología',
    province: 'Pichincha',
    city: 'Quito',
    phone: '+593 987654326',
    email: 'maria.fernandez@doctor.com',
    insurances: ['IESS', 'Qualitas'],
    status: 'active',
    rating: 4.8,
    reviews_count: 30,
    avatar: 'https://ui-avatars.com/api/?name=Maria+Fernandez&background=f59e0b&color=fff',
    bio: 'Oftalmóloga especializada en cirugía refractiva y glaucoma.',
    experience_years: 16,
    consultation_fee: 95,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 9,
    full_name: 'Dr. Andrés Morales',
    specialty: 'Ortopedia',
    province: 'Azuay',
    city: 'Cuenca',
    phone: '+593 987654327',
    email: 'andres.morales@doctor.com',
    insurances: ['Seguros del Ecuador', 'Pacífico Salud'],
    status: 'active',
    rating: 4.4,
    reviews_count: 15,
    avatar: 'https://ui-avatars.com/api/?name=Andres+Morales&background=dc2626&color=fff',
    bio: 'Ortopedista con especialización en cirugía articular y deportiva.',
    experience_years: 13,
    consultation_fee: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 10,
    full_name: 'Dra. Patricia Ruiz',
    specialty: 'Psiquiatría',
    province: 'Manabí',
    city: 'Portoviejo',
    phone: '+593 987654328',
    email: 'patricia.ruiz@doctor.com',
    insurances: ['IESS'],
    status: 'active',
    rating: 4.7,
    reviews_count: 22,
    avatar: 'https://ui-avatars.com/api/?name=Patricia+Ruiz&background=7c3aed&color=fff',
    bio: 'Psiquiatra especializada en trastornos de ansiedad y depresión.',
    experience_years: 11,
    consultation_fee: 85,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 11,
    full_name: 'Dr. Eduardo Vargas',
    specialty: 'Urología',
    province: 'Guayas',
    city: 'Guayaquil',
    phone: '+593 987654329',
    email: 'eduardo.vargas@doctor.com',
    insurances: ['IESS', 'Seguros del Ecuador'],
    status: 'active',
    rating: 4.5,
    reviews_count: 17,
    avatar: 'https://ui-avatars.com/api/?name=Eduardo+Vargas&background=059669&color=fff',
    bio: 'Urólogo con experiencia en tratamientos mínimamente invasivos.',
    experience_years: 20,
    consultation_fee: 90,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 12,
    full_name: 'Dra. Sofía Castro',
    specialty: 'Neurología',
    province: 'Pichincha',
    city: 'Quito',
    phone: '+593 987654330',
    email: 'sofia.castro@doctor.com',
    insurances: ['IESS', 'Qualitas'],
    status: 'active',
    rating: 4.8,
    reviews_count: 28,
    avatar: 'https://ui-avatars.com/api/?name=Sofia+Castro&background=ea580c&color=fff',
    bio: 'Neuróloga especializada en epilepsia y enfermedades neurodegenerativas.',
    experience_years: 15,
    consultation_fee: 95,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 13,
    full_name: 'Dr. Miguel Torres',
    specialty: 'Cirugía General',
    province: 'Tungurahua',
    city: 'Ambato',
    phone: '+593 987654331',
    email: 'miguel.torres@doctor.com',
    insurances: ['IESS', 'Seguros del Ecuador'],
    status: 'active',
    rating: 4.6,
    reviews_count: 19,
    avatar: 'https://ui-avatars.com/api/?name=Miguel+Torres&background=0891b2&color=fff',
    bio: 'Cirujano general con amplia experiencia en procedimientos laparoscópicos.',
    experience_years: 17,
    consultation_fee: 85,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 14,
    full_name: 'Dra. Carolina Mendoza',
    specialty: 'Endocrinología',
    province: 'Loja',
    city: 'Loja',
    phone: '+593 987654332',
    email: 'carolina.mendoza@doctor.com',
    insurances: ['IESS'],
    status: 'active',
    rating: 4.7,
    reviews_count: 21,
    avatar: 'https://ui-avatars.com/api/?name=Carolina+Mendoza&background=d97706&color=fff',
    bio: 'Endocrinóloga especializada en diabetes y trastornos tiroideos.',
    experience_years: 12,
    consultation_fee: 80,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 15,
    full_name: 'Dr. Fernando Herrera',
    specialty: 'Radiología',
    province: 'Pichincha',
    city: 'Quito',
    phone: '+593 987654333',
    email: 'fernando.herrera@doctor.com',
    insurances: ['IESS', 'Qualitas'],
    status: 'active',
    rating: 4.5,
    reviews_count: 14,
    avatar: 'https://ui-avatars.com/api/?name=Fernando+Herrera&background=7c2d12&color=fff',
    bio: 'Radiólogo con especialización en imagenología diagnóstica.',
    experience_years: 19,
    consultation_fee: 75,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const initialAppointments = [
  {
    id: 1,
    doctor_id: 2,
    patient_id: 3,
    date: '2024-01-25T10:00:00Z',
    status: 'confirmed',
    type: 'presencial',
    notes: 'Consulta de rutina - Control de presión arterial',
    symptoms: 'Dolor de pecho ocasional',
    diagnosis: 'Hipertensión leve',
    treatment: 'Medicación y dieta baja en sal',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    doctor_id: 4,
    patient_id: 7,
    date: '2024-01-26T14:30:00Z',
    status: 'confirmed',
    type: 'en-linea',
    notes: 'Consulta pediátrica - Control de crecimiento',
    symptoms: 'Resfriado común',
    diagnosis: 'Infección viral leve',
    treatment: 'Reposo y medicamentos sintomáticos',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    doctor_id: 6,
    patient_id: 8,
    date: '2024-01-27T09:00:00Z',
    status: 'pending',
    type: 'presencial',
    notes: 'Consulta ginecológica de rutina',
    symptoms: 'Dolor menstrual',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    doctor_id: 2,
    patient_id: 7,
    date: '2024-01-28T11:15:00Z',
    status: 'confirmed',
    type: 'presencial',
    notes: 'Seguimiento cardiológico',
    symptoms: 'Fatiga y falta de aire',
    diagnosis: 'Arritmia cardíaca',
    treatment: 'Medicación antiarrítmica',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    doctor_id: 9,
    patient_id: 18,
    date: '2024-01-29T15:00:00Z',
    status: 'confirmed',
    type: 'presencial',
    notes: 'Consulta ortopédica - Dolor de rodilla',
    symptoms: 'Dolor en rodilla derecha',
    diagnosis: 'Lesión meniscal',
    treatment: 'Fisioterapia y posible cirugía',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 6,
    doctor_id: 10,
    patient_id: 19,
    date: '2024-01-30T10:30:00Z',
    status: 'pending',
    type: 'en-linea',
    notes: 'Consulta psiquiátrica - Ansiedad',
    symptoms: 'Ansiedad generalizada',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 7,
    doctor_id: 13,
    patient_id: 20,
    date: '2024-01-31T08:00:00Z',
    status: 'confirmed',
    type: 'presencial',
    notes: 'Cirugía general - Apendicectomía',
    symptoms: 'Dolor abdominal agudo',
    diagnosis: 'Apendicitis aguda',
    treatment: 'Cirugía de urgencia',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 8,
    doctor_id: 14,
    patient_id: 3,
    date: '2024-02-01T13:45:00Z',
    status: 'confirmed',
    type: 'presencial',
    notes: 'Consulta neurológica - Migrañas',
    symptoms: 'Migrañas frecuentes',
    diagnosis: 'Migraña crónica',
    treatment: 'Medicación preventiva',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 9,
    doctor_id: 16,
    patient_id: 18,
    date: '2024-02-02T11:00:00Z',
    status: 'pending',
    type: 'en-linea',
    notes: 'Consulta endocrinológica - Diabetes',
    symptoms: 'Niveles altos de glucosa',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 10,
    doctor_id: 7,
    patient_id: 19,
    date: '2024-02-03T16:30:00Z',
    status: 'confirmed',
    type: 'presencial',
    notes: 'Consulta medicina interna - Hipertensión',
    symptoms: 'Presión arterial elevada',
    diagnosis: 'Hipertensión esencial',
    treatment: 'Medicación antihipertensiva',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const initialSpecialties = [
  { id: 1, name: 'Cardiología', description: 'Especialidad del corazón y sistema cardiovascular', active: true },
  { id: 2, name: 'Pediatría', description: 'Especialidad en el cuidado de niños y adolescentes', active: true },
  { id: 3, name: 'Dermatología', description: 'Especialidad de la piel, cabello y uñas', active: true },
  { id: 4, name: 'Ginecología', description: 'Especialidad en salud reproductiva femenina', active: true },
  { id: 5, name: 'Oftalmología', description: 'Especialidad de los ojos y visión', active: true },
  { id: 6, name: 'Ortopedia', description: 'Especialidad del sistema musculoesquelético', active: true },
  { id: 7, name: 'Psiquiatría', description: 'Especialidad de la salud mental', active: true },
  { id: 8, name: 'Neurología', description: 'Especialidad del sistema nervioso', active: true },
  { id: 9, name: 'Endocrinología', description: 'Especialidad de las glándulas y hormonas', active: true },
  { id: 10, name: 'Urología', description: 'Especialidad del sistema urinario', active: true }
]

// Helper functions to get/set data from localStorage
function getStorageData(key, defaultValue = []) {
  try {
    const data = localStorage.getItem(`mysimo_${key}`)
    return data ? JSON.parse(data) : defaultValue
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e)
    return defaultValue
  }
}

function setStorageData(key, data) {
  try {
    localStorage.setItem(`mysimo_${key}`, JSON.stringify(data))
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e)
  }
}

// Initialize data if not exists
export function initializeMockData() {
  if (!localStorage.getItem('mysimo_users')) {
    setStorageData('users', initialUsers)
  }
  if (!localStorage.getItem('mysimo_doctors')) {
    setStorageData('doctors', initialDoctors)
  }
  if (!localStorage.getItem('mysimo_appointments')) {
    setStorageData('appointments', initialAppointments)
  }
  if (!localStorage.getItem('mysimo_specialties')) {
    setStorageData('specialties', initialSpecialties)
  }
  
  // Ensure data consistency
  ensureDataConsistency()
}

// Ensure users and doctors are consistent
function ensureDataConsistency() {
  const users = getStorageData('users', [])
  const doctors = getStorageData('doctors', [])
  
  // For each user with role 'doctor', ensure they have a doctor record
  users.forEach(user => {
    if (user.role === 'doctor') {
      const doctorExists = doctors.find(d => d.id === user.id)
      if (!doctorExists) {
        console.warn(`Doctor record missing for user ${user.id}, creating...`)
        const newDoctor = {
          id: user.id,
          full_name: user.name,
          email: user.email,
          specialty: 'General',
          province: '',
          city: '',
          phone: '',
          insurances: [],
          status: 'pending',
          rating: 0,
          reviews_count: 0,
          avatar: user.avatar || null,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
        doctors.push(newDoctor)
      }
    }
  })
  
  // For each doctor, ensure they have a user record
  doctors.forEach(doctor => {
    const userExists = users.find(u => u.id === doctor.id)
    if (!userExists) {
      console.warn(`User record missing for doctor ${doctor.id}, creating...`)
      const newUser = {
        id: doctor.id,
        name: doctor.full_name,
        email: doctor.email,
        role: 'doctor',
        avatar: doctor.avatar,
        created_at: doctor.created_at,
        updated_at: doctor.updated_at
      }
      users.push(newUser)
    }
  })
  
  setStorageData('users', users)
  setStorageData('doctors', doctors)
}

// Reset all data to initial state
export function resetMockData() {
  localStorage.removeItem('mysimo_users')
  localStorage.removeItem('mysimo_doctors')
  localStorage.removeItem('mysimo_appointments')
  localStorage.removeItem('mysimo_specialties')
  localStorage.removeItem('mysimo_auth')
  initializeMockData()
}

// Mock API functions
export const mockApi = {
  // Auth
  login: async (email, password) => {
    const users = getStorageData('users', [])
    const user = users.find(u => u.email === email)
    if (!user) throw new Error('Usuario no encontrado')
    // Check password - use stored password if exists, otherwise default
    const expectedPassword = user.password || 'password123'
    if (password !== expectedPassword) {
      throw new Error('Contraseña incorrecta')
    }
    // Check if doctor is approved
    if (user.role === 'doctor') {
      const doctors = getStorageData('doctors', [])
      const doctor = doctors.find(d => d.id === user.id)
      if (!doctor) {
        throw new Error('Perfil de doctor no encontrado. Contacta al administrador.')
      }
      // Allow login for pending doctors, but they will have limited access
      // Only block if explicitly rejected
      if (doctor.status === 'rejected') {
        throw new Error('Tu cuenta ha sido rechazada por el administrador.')
      }
    }
    const token = `mock_token_${user.id}_${Date.now()}`
    return { user, token }
  },

  register: async (payload) => {
    const users = getStorageData('users', [])
    const doctors = getStorageData('doctors', [])

    // Check if email exists
    const existingUser = users.find(u => u.email === payload.email)
    if (existingUser) {
      // If user exists but is not a doctor, throw error
      if (existingUser.role !== 'doctor') {
        throw new Error('Email ya registrado')
      }
      // If user exists and is a doctor, just return existing data
      const existingDoctor = doctors.find(d => d.id === existingUser.id)
      if (existingDoctor) {
        const token = `mock_token_${existingUser.id}_${Date.now()}`
        return { user: existingUser, token }
      }
    }

    let newUser = null
    let shouldCreateDoctor = true

    try {
      newUser = {
        id: Date.now(),
        name: payload.full_name,
        email: payload.email,
        role: payload.role,
        password: payload.password, // Store password
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      users.push(newUser)
      setStorageData('users', users)
    } catch (error) {
      // If user creation fails, still try to create doctor for admin review
      console.error('Error creating user:', error)
      shouldCreateDoctor = true
      newUser = {
        id: Date.now(),
        name: payload.full_name,
        email: payload.email,
        role: payload.role,
        password: payload.password, // Store password
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    if (payload.role === 'doctor' && shouldCreateDoctor) {
      const newDoctor = {
        id: newUser.id,
        full_name: payload.full_name,
        specialty: payload.specialty,
        province: payload.province,
        city: payload.city,
        phone: payload.phone,
        email: payload.email,
        insurances: payload.insurances,
        status: 'pending',
        rating: 0,
        reviews_count: 0,
        avatar: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      doctors.push(newDoctor)
      setStorageData('doctors', doctors)
    }

    const token = `mock_token_${newUser.id}_${Date.now()}`
    return { user: newUser, token }
  },

  // Users
  getUsers: async (params = {}) => {
    let users = getStorageData('users', [])
    
    // Apply filters
    if (params.role) {
      users = users.filter(u => u.role === params.role)
    }
    if (params.q) {
      const query = params.q.toLowerCase()
      users = users.filter(u => 
        u.name.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query)
      )
    }

    // Pagination
    const page = parseInt(params.page) || 1
    const limit = parseInt(params.limit) || 20
    const start = (page - 1) * limit
    const paginatedUsers = users.slice(start, start + limit)

    return {
      data: paginatedUsers,
      meta: {
        pagination: {
          total: users.length,
          page,
          limit,
          pages: Math.ceil(users.length / limit)
        }
      }
    }
  },

  createUser: async (userData) => {
    const users = getStorageData('users', [])
    const doctors = getStorageData('doctors', [])
    const newUser = {
      id: Date.now(),
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    users.push(newUser)
    setStorageData('users', users)
    
    // If user is a doctor, create doctor record
    if (userData.role === 'doctor') {
      const newDoctor = {
        id: newUser.id,
        full_name: userData.name,
        specialty: 'General', // Default
        province: '',
        city: '',
        phone: '',
        email: userData.email,
        insurances: [],
        status: 'pending',
        rating: 0,
        reviews_count: 0,
        avatar: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      doctors.push(newDoctor)
      setStorageData('doctors', doctors)
    }
    
    return newUser
  },

  updateUser: async (id, userData) => {
    const users = getStorageData('users', [])
    const doctors = getStorageData('doctors', [])
    const index = users.findIndex(u => u.id == id)
    if (index === -1) throw new Error('Usuario no encontrado')
    
    const oldUser = users[index]
    users[index] = { ...users[index], ...userData, updated_at: new Date().toISOString() }
    setStorageData('users', users)

    // Si cambió a doctor, crear entrada en doctors si no existe
    if (userData.role === 'doctor' && oldUser.role !== 'doctor') {
      const existingDoctor = doctors.find(d => d.id == id)
      if (!existingDoctor) {
        const newDoctor = {
          id: id,
          full_name: users[index].name,
          specialty: 'General', // Default
          province: '',
          city: '',
          phone: '',
          email: users[index].email,
          insurances: [],
          status: 'pending',
          rating: 0,
          reviews_count: 0,
          avatar: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        doctors.push(newDoctor)
        setStorageData('doctors', doctors)
      }
    }

    // Si cambió de doctor a otro rol, opcionalmente eliminar de doctors
    // Pero por ahora, dejarlo para que admin lo maneje manualmente

    return users[index]
  },

  deleteUser: async (id) => {
    const users = getStorageData('users', [])
    const filtered = users.filter(u => u.id != id)
    setStorageData('users', filtered)
  },

  // Doctors CRUD
  getDoctors: async (params = {}) => {
    let doctors = getStorageData('doctors', [])
    const specialties = getStorageData('specialties', [])
    const cities = getStorageData('cities', [])
    
    // Populate relations
    doctors = doctors.map(doctor => {
      const specialty = specialties.find(s => s.id == doctor.specialtyId || s.name === doctor.specialty)
      const city = cities.find(c => c.id == doctor.cityId || c.name === doctor.city)
      
      return {
        ...doctor,
        specialty: specialty || { name: doctor.specialty || 'No especificada' },
        city: city || { name: doctor.city || 'No especificada' }
      }
    })
    
    // Apply filters
    if (params.q) {
      const query = params.q.toLowerCase()
      doctors = doctors.filter(d => 
        d.full_name.toLowerCase().includes(query) ||
        d.specialty.name.toLowerCase().includes(query) ||
        d.city.name.toLowerCase().includes(query)
      )
    }
    if (params.city) {
      doctors = doctors.filter(d => d.city.name.toLowerCase().includes(params.city.toLowerCase()))
    }
    if (params.specialty) {
      doctors = doctors.filter(d => d.specialty.name.toLowerCase().includes(params.specialty.toLowerCase()))
    }
    if (params.status) {
      doctors = doctors.filter(d => d.status === params.status)
    }

    // Pagination
    const page = parseInt(params.page) || 1
    const limit = parseInt(params.limit) || 10
    const start = (page - 1) * limit
    const paginatedDoctors = doctors.slice(start, start + limit)

    return {
      doctors: paginatedDoctors,
      featured: [], // No featured for now
      meta: {
        pagination: {
          total: doctors.length,
          page,
          limit,
          pages: Math.ceil(doctors.length / limit)
        }
      }
    }
  },

  getDoctor: async (id) => {
    const doctors = getStorageData('doctors', [])
    const doctor = doctors.find(d => d.id == id)
    if (!doctor) throw new Error('Doctor no encontrado')
    return doctor
  },

  getCurrentDoctor: async () => {
    // Get current user from auth
    const authStr = localStorage.getItem('mysimo_auth')
    if (!authStr) throw new Error('No autenticado')
    
    const auth = JSON.parse(authStr)
    if (!auth.user) throw new Error('Usuario no encontrado')
    
    const doctors = getStorageData('doctors', [])
    const doctor = doctors.find(d => d.id == auth.user.id)
    if (!doctor) throw new Error('Doctor no encontrado')
    
    return doctor
  },

  updateDoctor: async (id, data) => {
    const doctors = getStorageData('doctors', [])
    const index = doctors.findIndex(d => d.id == id)
    if (index === -1) throw new Error('Doctor no encontrado')
    doctors[index] = { ...doctors[index], ...data, updated_at: new Date().toISOString() }
    setStorageData('doctors', doctors)
    return doctors[index]
  },

  createDoctor: async (doctorData) => {
    const doctors = getStorageData('doctors', [])
    const users = getStorageData('users', [])
    const specialties = getStorageData('specialties', [])
    const cities = getStorageData('cities', [])
    
    // Check if user already exists with this email
    const existingUser = users.find(u => u.email === doctorData.email)
    if (existingUser) {
      throw new Error('Ya existe un usuario con este email')
    }
    
    // Create user account first
    const newUser = {
      id: Date.now(),
      name: doctorData.fullName,
      email: doctorData.email,
      role: 'doctor',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Hash password (simple for MVP)
    if (doctorData.password) {
      // In real app, use bcrypt
      newUser.password = doctorData.password // Store as is for MVP
    }
    
    users.push(newUser)
    setStorageData('users', users)
    
    // Get specialty and city names
    const specialty = specialties.find(s => s.id == doctorData.specialtyId)
    const city = cities.find(c => c.id == doctorData.cityId)
    
    // Create doctor record
    const newDoctor = {
      id: newUser.id,
      full_name: doctorData.fullName,
      email: doctorData.email,
      specialtyId: doctorData.specialtyId,
      specialty: specialty ? specialty.name : 'General',
      cityId: doctorData.cityId,
      city: city ? city.name : '',
      province: doctorData.province || '',
      phone: doctorData.whatsapp || '',
      insurances: doctorData.insurances || [],
      status: doctorData.status || 'pending',
      rating: 0,
      reviews_count: 0,
      bio: doctorData.about || '',
      experience_years: 0,
      consultation_fee: doctorData.price || 0,
      avatar: doctorData.photoUrl || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    doctors.push(newDoctor)
    setStorageData('doctors', doctors)
    return newDoctor
  },

  updateDoctor: async (id, doctorData) => {
    const doctors = getStorageData('doctors', [])
    const users = getStorageData('users', [])
    const specialties = getStorageData('specialties', [])
    const cities = getStorageData('cities', [])
    const index = doctors.findIndex(d => d.id == id)
    if (index === -1) throw new Error('Doctor no encontrado')
    
    // Get specialty and city names
    const specialty = specialties.find(s => s.id == doctorData.specialtyId)
    const city = cities.find(c => c.id == doctorData.cityId)
    
    // Update doctor record
    const updatedDoctor = {
      ...doctors[index],
      ...doctorData,
      specialtyId: doctorData.specialtyId || doctors[index].specialtyId,
      specialty: specialty ? specialty.name : doctors[index].specialty,
      cityId: doctorData.cityId || doctors[index].cityId,
      city: city ? city.name : doctors[index].city,
      updated_at: new Date().toISOString()
    }
    
    doctors[index] = updatedDoctor
    setStorageData('doctors', doctors)
    
    // Update corresponding user record
    const userIndex = users.findIndex(u => u.id == id)
    if (userIndex !== -1) {
      const userUpdates = {}
      if (doctorData.fullName) userUpdates.name = doctorData.fullName
      if (doctorData.email) userUpdates.email = doctorData.email
      if (doctorData.password) userUpdates.password = doctorData.password
      
      if (Object.keys(userUpdates).length > 0) {
        users[userIndex] = { ...users[userIndex], ...userUpdates, updated_at: new Date().toISOString() }
        setStorageData('users', users)
      }
    }
    
    return doctors[index]
  },

  approveDoctor: async (id) => {
    const doctors = getStorageData('doctors', [])
    const index = doctors.findIndex(d => d.id == id)
    if (index === -1) throw new Error('Doctor no encontrado')
    
    doctors[index] = { ...doctors[index], status: 'active', updated_at: new Date().toISOString() }
    setStorageData('doctors', doctors)
    return doctors[index]
  },

  rejectDoctor: async (id) => {
    const doctors = getStorageData('doctors', [])
    const index = doctors.findIndex(d => d.id == id)
    if (index === -1) throw new Error('Doctor no encontrado')
    
    doctors[index] = { ...doctors[index], status: 'rejected', updated_at: new Date().toISOString() }
    setStorageData('doctors', doctors)
    return doctors[index]
  },

  deleteDoctor: async (id) => {
    const doctors = getStorageData('doctors', [])
    const filtered = doctors.filter(d => d.id != id)
    setStorageData('doctors', filtered)
  },

  // Appointments
  getAppointments: async (params = {}) => {
    let appointments = getStorageData('appointments', [])
    
    // Filter by user role
    const auth = JSON.parse(localStorage.getItem('mysimo_auth') || 'null')
    if (auth?.user?.role === 'doctor') {
      appointments = appointments.filter(a => a.doctor_id == auth.user.id)
    } else if (auth?.user?.role === 'patient') {
      appointments = appointments.filter(a => a.patient_id == auth.user.id)
    }

    // Apply filters
    if (params.status) {
      appointments = appointments.filter(a => a.status === params.status)
    }
    if (params.date) {
      appointments = appointments.filter(a => a.date.startsWith(params.date))
    }

    return {
      data: appointments,
      meta: {
        pagination: {
          total: appointments.length,
          page: 1,
          limit: appointments.length,
          pages: 1
        }
      }
    }
  },

  getAllAppointments: async (params = {}) => {
    let appointments = getStorageData('appointments', [])
    
    // Apply filters
    if (params.status) {
      appointments = appointments.filter(a => a.status === params.status)
    }
    if (params.date) {
      appointments = appointments.filter(a => a.date.startsWith(params.date))
    }

    // Add doctor and patient names
    const users = getStorageData('users', [])
    appointments = appointments.map(apt => ({
      ...apt,
      doctor_name: users.find(u => u.id == apt.doctor_id)?.name || 'Doctor desconocido',
      patient_name: users.find(u => u.id == apt.patient_id)?.name || 'Paciente desconocido'
    }))

    return {
      data: appointments,
      meta: {
        pagination: {
          total: appointments.length,
          page: 1,
          limit: appointments.length,
          pages: 1
        }
      }
    }
  },

  createAppointment: async (appointmentData) => {
    const appointments = getStorageData('appointments', [])
    const newAppointment = {
      id: Date.now(),
      ...appointmentData,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    appointments.push(newAppointment)
    setStorageData('appointments', appointments)
    return newAppointment
  },

  updateAppointment: async (id, appointmentData) => {
    const appointments = getStorageData('appointments', [])
    const index = appointments.findIndex(a => a.id == id)
    if (index === -1) throw new Error('Cita no encontrada')
    
    appointments[index] = { ...appointments[index], ...appointmentData, updated_at: new Date().toISOString() }
    setStorageData('appointments', appointments)
    return appointments[index]
  },

  deleteAppointment: async (id) => {
    const appointments = getStorageData('appointments', [])
    const filtered = appointments.filter(a => a.id != id)
    setStorageData('appointments', filtered)
  },

  // Specialties
  getSpecialties: async () => {
    return getStorageData('specialties', [])
  },

  createSpecialty: async (data) => {
    const specialties = getStorageData('specialties', [])
    const newSpecialty = {
      id: Date.now(),
      ...data,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    specialties.push(newSpecialty)
    setStorageData('specialties', specialties)
    return newSpecialty
  },

  updateSpecialty: async (id, data) => {
    const specialties = getStorageData('specialties', [])
    const index = specialties.findIndex(s => s.id == id)
    if (index === -1) throw new Error('Especialidad no encontrada')
    
    specialties[index] = { ...specialties[index], ...data, updated_at: new Date().toISOString() }
    setStorageData('specialties', specialties)
    return specialties[index]
  },

  deleteSpecialty: async (id) => {
    const specialties = getStorageData('specialties', [])
    const filtered = specialties.filter(s => s.id != id)
    setStorageData('specialties', filtered)
  }
}