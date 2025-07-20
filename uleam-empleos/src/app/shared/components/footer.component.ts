import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="bg-dark text-light py-4 mt-5">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h5 class="text-primary mb-3">
              <i class="bi bi-briefcase-fill me-2"></i>
              ULEAM Empleos
            </h5>
            <p class="mb-2">
              Plataforma oficial de empleos de la Universidad Laica Eloy Alfaro
              de Manabí.
            </p>
            <p class="small text-muted">
              Conectando talento con oportunidades en Ecuador.
            </p>
          </div>

          <div class="col-md-3">
            <h6 class="mb-3">Enlaces Útiles</h6>
            <ul class="list-unstyled">
              <li>
                <a href="#" class="text-light text-decoration-none small"
                  >Sobre ULEAM</a
                >
              </li>
              <li>
                <a href="#" class="text-light text-decoration-none small"
                  >Carreras</a
                >
              </li>
              <li>
                <a href="#" class="text-light text-decoration-none small"
                  >Graduados</a
                >
              </li>
              <li>
                <a href="#" class="text-light text-decoration-none small"
                  >Empresas</a
                >
              </li>
            </ul>
          </div>

          <div class="col-md-3">
            <h6 class="mb-3">Contacto</h6>
            <ul class="list-unstyled small">
              <li class="mb-1">
                <i class="bi bi-geo-alt me-2"></i>
                Manta, Manabí, Ecuador
              </li>
              <li class="mb-1">
                <i class="bi bi-envelope me-2"></i>
                empleos&#64;uleam.edu.ec
              </li>
              <li class="mb-1">
                <i class="bi bi-telephone me-2"></i>
                (05) 2623-740
              </li>
            </ul>
          </div>
        </div>

        <hr class="my-4" />

        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="small mb-0">
              &copy; {{ currentYear }} Universidad Laica Eloy Alfaro de Manabí.
              Todos los derechos reservados.
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <div class="social-links">
              <a href="#" class="text-light me-3" title="Facebook">
                <i class="bi bi-facebook"></i>
              </a>
              <a href="#" class="text-light me-3" title="Twitter">
                <i class="bi bi-twitter"></i>
              </a>
              <a href="#" class="text-light me-3" title="LinkedIn">
                <i class="bi bi-linkedin"></i>
              </a>
              <a href="#" class="text-light" title="Instagram">
                <i class="bi bi-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      footer {
        margin-top: auto;
      }

      .social-links a {
        font-size: 1.2rem;
        transition: color 0.3s ease;
      }

      .social-links a:hover {
        color: var(--primary-color) !important;
      }

      .list-unstyled a {
        display: block;
        padding: 0.25rem 0;
        transition: color 0.3s ease;
      }

      .list-unstyled a:hover {
        color: var(--primary-color) !important;
      }
    `,
  ],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
