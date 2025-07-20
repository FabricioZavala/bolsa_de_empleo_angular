<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# ULEAM Empleos - Instrucciones para Copilot

Este es un proyecto de sistema de bolsa de empleos desarrollado con Angular 18 usando standalone components.

## Arquitectura del Proyecto

- **Core**: Servicios, guards y modelos (`src/app/core/`)
- **Features**: Módulos por funcionalidad (`src/app/features/`)
  - `auth/`: Autenticación y registro
  - `graduate/`: Funcionalidades para graduados
  - `employer/`: Funcionalidades para empleadores
- **Shared**: Componentes reutilizables (`src/app/shared/`)

## Reglas de Desarrollo

1. **TypeScript Estricto**: Sin usar 'any', tipado fuerte en todo el código
2. **Standalone Components**: No usar NgModule, solo standalone components
3. **Reactive Forms**: Usar FormBuilder y validaciones Angular
4. **Guards por Rol**: AuthGuard, GraduateGuard, EmployerGuard
5. **Lazy Loading**: Cargar features bajo demanda
6. **LocalStorage**: Persistencia de datos sin base de datos
7. **Bootstrap 5**: Diseño responsive con paleta LinkedIn (#0A66C2, #666, blanco)
8. **RxJS**: Usar Observables para servicios, mockear datos con 'of()'
9. **TrackBy**: Implementar en todos los ngFor
10. **Sin .spec.ts**: No generar archivos de testing

## Modelos de Datos

- User: id, email, password, role, createdAt, profile
- GraduateProfile: datos personales, educación, experiencia, habilidades
- EmployerProfile: información de empresa
- Job: empleos publicados
- Application: postulaciones

## Compatibilidad Vercel

- Optimizado para deployment en Vercel
- Configuración de producción habilitada
