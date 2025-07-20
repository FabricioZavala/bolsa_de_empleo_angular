import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="text-center mb-5">
            <h1 class="display-5 fw-bold text-primary">Contáctanos</h1>
            <p class="lead text-secondary">
              ¿Tienes preguntas? Estamos aquí para ayudarte. Ponte en contacto
              con nosotros.
            </p>
          </div>

          <div class="row g-4 mb-5">
            <div class="col-md-4 text-center">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-body py-4">
                  <i class="bi bi-geo-alt-fill text-primary fs-1 mb-3"></i>
                  <h5 class="fw-bold">Ubicación</h5>
                  <p class="text-secondary mb-0">
                    Universidad Laica Eloy Alfaro de Manabí<br />
                    Manta, Manabí, Ecuador
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-4 text-center">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-body py-4">
                  <i class="bi bi-envelope-fill text-primary fs-1 mb-3"></i>
                  <h5 class="fw-bold">Email</h5>
                  <p class="text-secondary mb-0">
                    empleos&#64;uleam.edu.ec<br />
                    info&#64;uleam.edu.ec
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-4 text-center">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-body py-4">
                  <i class="bi bi-telephone-fill text-primary fs-1 mb-3"></i>
                  <h5 class="fw-bold">Teléfono</h5>
                  <p class="text-secondary mb-0">
                    (05) 2623-740<br />
                    (05) 2623-741
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
              <h4 class="mb-0">Envíanos un Mensaje</h4>
            </div>
            <div class="card-body">
              <form (ngSubmit)="onSubmit()" #contactForm="ngForm">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="name" class="form-label"
                      >Nombre Completo *</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      name="name"
                      [(ngModel)]="formData.name"
                      required
                      #nameField="ngModel"
                    />
                    <div
                      class="text-danger small mt-1"
                      *ngIf="nameField.invalid && nameField.touched"
                    >
                      El nombre es requerido
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="email" class="form-label">Email *</label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      name="email"
                      [(ngModel)]="formData.email"
                      required
                      email
                      #emailField="ngModel"
                    />
                    <div
                      class="text-danger small mt-1"
                      *ngIf="emailField.invalid && emailField.touched"
                    >
                      <span *ngIf="emailField.errors?.['required']"
                        >El email es requerido</span
                      >
                      <span *ngIf="emailField.errors?.['email']"
                        >Ingresa un email válido</span
                      >
                    </div>
                  </div>

                  <div class="col-12">
                    <label for="subject" class="form-label">Asunto *</label>
                    <select
                      class="form-select"
                      id="subject"
                      name="subject"
                      [(ngModel)]="formData.subject"
                      required
                      #subjectField="ngModel"
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="empleo">Consulta sobre empleos</option>
                      <option value="registro">Problema con registro</option>
                      <option value="empresa">Información para empresas</option>
                      <option value="tecnico">Soporte técnico</option>
                      <option value="otro">Otro</option>
                    </select>
                    <div
                      class="text-danger small mt-1"
                      *ngIf="subjectField.invalid && subjectField.touched"
                    >
                      Selecciona un asunto
                    </div>
                  </div>

                  <div class="col-12">
                    <label for="message" class="form-label">Mensaje *</label>
                    <textarea
                      class="form-control"
                      id="message"
                      name="message"
                      rows="5"
                      [(ngModel)]="formData.message"
                      required
                      minlength="10"
                      #messageField="ngModel"
                      placeholder="Describe tu consulta en detalle..."
                    ></textarea>
                    <div
                      class="text-danger small mt-1"
                      *ngIf="messageField.invalid && messageField.touched"
                    >
                      <span *ngIf="messageField.errors?.['required']"
                        >El mensaje es requerido</span
                      >
                      <span *ngIf="messageField.errors?.['minlength']"
                        >El mensaje debe tener al menos 10 caracteres</span
                      >
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="privacy"
                        name="privacy"
                        [(ngModel)]="formData.acceptPrivacy"
                        required
                        #privacyField="ngModel"
                      />
                      <label class="form-check-label" for="privacy">
                        Acepto el tratamiento de mis datos personales según la
                        política de privacidad *
                      </label>
                      <div
                        class="text-danger small mt-1"
                        *ngIf="privacyField.invalid && privacyField.touched"
                      >
                        Debes aceptar la política de privacidad
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <button
                      type="submit"
                      class="btn btn-primary btn-lg w-100"
                      [disabled]="contactForm.invalid || isSubmitting"
                    >
                      <span
                        *ngIf="isSubmitting"
                        class="spinner-border spinner-border-sm me-2"
                      ></span>
                      {{ isSubmitting ? 'Enviando...' : 'Enviar Mensaje' }}
                    </button>
                  </div>
                </div>
              </form>

              <div class="alert alert-success mt-3" *ngIf="showSuccessMessage">
                <i class="bi bi-check-circle me-2"></i>
                ¡Mensaje enviado correctamente! Te contactaremos pronto.
              </div>
            </div>
          </div>

          <div class="row mt-5">
            <div class="col-12">
              <div class="card bg-light">
                <div class="card-body">
                  <h5 class="fw-bold mb-3">Horarios de Atención</h5>
                  <div class="row">
                    <div class="col-md-6">
                      <p class="mb-2"><strong>Lunes a Viernes:</strong></p>
                      <p class="text-secondary">8:00 AM - 5:00 PM</p>
                    </div>
                    <div class="col-md-6">
                      <p class="mb-2"><strong>Sábados:</strong></p>
                      <p class="text-secondary">8:00 AM - 12:00 PM</p>
                    </div>
                  </div>
                  <p class="small text-muted mb-0">
                    <i class="bi bi-info-circle me-1"></i>
                    Responderemos tu consulta en un plazo máximo de 24 horas
                    hábiles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
      }

      .form-control:focus,
      .form-select:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 0.2rem rgba(10, 102, 194, 0.25);
      }

      .form-check-input:checked {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
      }
    `,
  ],
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: '',
    acceptPrivacy: false,
  };

  isSubmitting = false;
  showSuccessMessage = false;

  onSubmit(): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    // Simular envío del formulario
    setTimeout(() => {
      this.isSubmitting = false;
      this.showSuccessMessage = true;

      // Resetear formulario
      this.formData = {
        name: '',
        email: '',
        subject: '',
        message: '',
        acceptPrivacy: false,
      };

      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 5000);
    }, 2000);
  }
}
