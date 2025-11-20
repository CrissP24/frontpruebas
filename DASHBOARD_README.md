# Dashboards MySimo - Documentación

## Resumen

Se han creado dashboards completos y bien diseñados para cada tipo de usuario (Patient, Doctor, Admin) con diseño moderno, responsive y funcional.

## Estructura

### Componentes Reutilizables

#### `components/dashboard/StatCard.jsx`
Tarjeta de estadísticas con icono, título, valor y subtítulo.
- Props: `icon`, `title`, `value`, `subtitle`, `trend`, `color`
- Colores disponibles: `primary`, `accent`, `success`, `warning`, `danger`

#### `components/dashboard/AppointmentCard.jsx`
Tarjeta de cita médica con información completa.
- Props: `appointment`, `onAction`, `actionLabel`, `showDoctor`, `showPatient`
- Muestra fecha, hora, estado, doctor/paciente y notas

#### `components/dashboard/IconComponents.jsx`
Colección de iconos SVG reutilizables:
- `CalendarIcon`, `UserIcon`, `ClockIcon`, `CheckCircleIcon`, `XCircleIcon`
- `ChartBarIcon`, `HomeIcon`, `SettingsIcon`, `LogoutIcon`, `DoctorIcon`, `UsersIcon`

### Layout

#### `layouts/DashboardLayout.jsx`
Layout principal del dashboard con:
- Sidebar sticky con navegación por rol
- Información del usuario
- Botón de cerrar sesión
- Diseño responsive

### Dashboards por Rol

#### `pages/dashboard/PatientDashboard.jsx`
Dashboard para pacientes con:
- Estadísticas: Total de citas, Pendientes, Confirmadas, Canceladas
- Acciones rápidas: Reservar cita, Buscar doctores
- Próximas citas con detalles completos

#### `pages/dashboard/DoctorDashboard.jsx`
Dashboard para médicos con:
- Estadísticas: Total, Hoy, Pendientes, Confirmadas, Canceladas
- Citas de hoy destacadas
- Citas pendientes de confirmar con acciones (Confirmar/Cancelar)
- Acciones rápidas: Ver todas las citas, Estadísticas, Editar perfil

#### `pages/dashboard/AdminDashboard.jsx`
Dashboard para administradores con:
- Estadísticas: Usuarios, Doctores, Citas, Especialidades
- Tarjetas de acción rápida para gestionar diferentes secciones
- Información del sistema

## Características

### Diseño
- ✅ Diseño moderno y limpio
- ✅ Responsive (móvil, tablet, desktop)
- ✅ Colores consistentes con el tema de la aplicación
- ✅ Iconos SVG personalizados
- ✅ Animaciones suaves y transiciones
- ✅ Tarjetas con sombras y efectos hover

### Funcionalidad
- ✅ Carga de datos desde API
- ✅ Manejo de estados de carga
- ✅ Manejo de errores
- ✅ Actualización de estados en tiempo real
- ✅ Navegación entre secciones
- ✅ Acciones rápidas contextuales

### Responsive
- ✅ Grid adaptativo para estadísticas
- ✅ Sidebar colapsable en móvil (futuro)
- ✅ Cards apilables en pantallas pequeñas
- ✅ Botones con tamaños táctiles apropiados

## Uso

### Dashboard Principal
El componente `pages/Dashboard.jsx` actúa como router que muestra el dashboard correspondiente según el rol del usuario.

```jsx
import Dashboard from './pages/Dashboard'

// Automáticamente muestra el dashboard correcto según el rol
<Dashboard />
```

### Navegación
El layout incluye navegación por rol:
- **Patient**: Inicio, Mis Citas, Mi Perfil
- **Doctor**: Inicio, Mis Citas, Mi Perfil, Estadísticas
- **Admin**: Inicio, Usuarios, Doctores, Citas, Configuración

## Mejoras Futuras

- [ ] Gráficos y visualizaciones (chart.js o recharts)
- [ ] Filtros y búsqueda en listas de citas
- [ ] Notificaciones en tiempo real
- [ ] Exportación de datos (PDF, Excel)
- [ ] Calendario interactivo
- [ ] Modo oscuro
- [ ] Sidebar colapsable en móvil
- [ ] Animaciones de carga (skeleton screens)
- [ ] Paginación en listas grandes
- [ ] Filtros avanzados para citas

## Estilos

Los dashboards usan las clases CSS personalizadas definidas en `index.css`:
- `.card`: Tarjetas con sombra y borde
- `.btn-primary`, `.btn-outline`: Botones estilizados
- Variables CSS para colores: `--primary`, `--bg`, `--surface`, etc.

## API Endpoints Utilizados

- `GET /api/appointments/me` - Obtener citas del usuario
- `PATCH /api/appointments/:id/status` - Actualizar estado de cita
- `GET /api/doctors` - Listar doctores (para admin)
- `GET /api/specialties` - Listar especialidades (futuro)
- `GET /api/cities` - Listar ciudades (futuro)

## Notas

- El interceptor de axios maneja automáticamente la autenticación
- Los tokens se almacenan en `localStorage` como `mysimo_auth`
- Las respuestas de la API se normalizan automáticamente
- Los errores 401 redirigen automáticamente al login





