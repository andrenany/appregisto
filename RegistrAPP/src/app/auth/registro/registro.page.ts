import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';//importamos el modulo para trabajar rutas de angular
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { EstadoService } from '../../servicios/estado.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})

export class RegistroPage implements OnInit {
  
  // Declaramos variable
  registroForm: FormGroup;
  contador: number = 0; // Variable para el contador

  constructor(
    private estadoService: EstadoService, 
    private router: Router, 
    public fb: FormBuilder, 
    public alertController: AlertController
  ) { 
    this.registroForm = this.fb.group({
      'usuario': new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(8)]),
      'password': new FormControl("", [Validators.required, Validators.pattern(/^\d{4}$/)]),
      'confirmacionPassword': new FormControl("", [Validators.required, Validators.pattern(/^\d{4}$/)])
    });
  }

  navigateTologin() {
    this.router.navigate(['/login']); // Navegamos hacia la página del login
    this.estadoService.reiniciar(); 
  }

  ngOnInit() {
    // Mensaje de consola para depuración
    console.log('ngOnInit el componente se ha inicializado');
    
    // Suscribirse al observable para recibir actualizaciones de la variable
    this.estadoService.contadorActual.subscribe(valor => {
      this.contador = valor;
      console.log('ngOnInit Contador Actualizado', this.contador);
    });
  }

  async guardar() {
    if (this.registroForm.invalid) {
      const errors = this.registroForm.controls;

      if (errors['usuario'].errors) {
        const alert = await this.alertController.create({
          header: 'Error en Usuario',
          message: this.getUsuarioErrorMessage(),
          buttons: ['Aceptar']
        });
        await alert.present();
        return;
      }

      if (errors['password'].errors) {
        const alert = await this.alertController.create({
          header: 'Error en Contraseña',
          message: this.getPasswordErrorMessage(),
          buttons: ['Aceptar']
        });
        await alert.present();
        return;
      }

      if (errors['confirmacionPassword'].errors) {
        const alert = await this.alertController.create({
          header: 'Error en Confirmación de Contraseña',
          message: this.getConfirmacionPasswordErrorMessage(),
          buttons: ['Aceptar']
        });
        await alert.present();
        return;
      }
    }

    const f = this.registroForm.value;
    const usuario = {
      usuario: f.usuario,
      password: f.password
    };
    localStorage.setItem('usuario', JSON.stringify(usuario));

    // Mostrar mensaje de éxito antes de navegar
    const successAlert = await this.alertController.create({
      header: 'Cuenta creada',
      message: 'Tu cuenta fue creada con éxito.',
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          // Navegamos a la página de login después de que el usuario cierre el alerta
          this.router.navigate(['/login']);
          this.estadoService.reiniciar();
        }
      }]
    });

    await successAlert.present();
  }

  // Funciones para obtener mensajes de error
  getUsuarioErrorMessage() {
    const usuarioControl = this.registroForm.controls['usuario'];
    if (usuarioControl.errors?.['required']) {
      return 'El campo de usuario es obligatorio.';
    }
    if (usuarioControl.errors?.['minlength']) {
      return 'El usuario debe tener al menos 3 caracteres.';
    }
    if (usuarioControl.errors?.['maxlength']) {
      return 'El usuario no puede tener más de 8 caracteres.';
    }
    return 'Error desconocido en el campo de usuario.';
  }

  getPasswordErrorMessage() {
    const passwordControl = this.registroForm.controls['password'];
    if (passwordControl.errors?.['required']) {
      return 'La contraseña es obligatoria.';
    }
    if (passwordControl.errors?.['pattern']) {
      return 'La contraseña debe contener exactamente 4 dígitos.';
    }
    return 'Error desconocido en el campo de contraseña.';
  }

  getConfirmacionPasswordErrorMessage() {
    const confirmacionPasswordControl = this.registroForm.controls['confirmacionPassword'];
    if (confirmacionPasswordControl.errors?.['required']) {
      return 'La confirmación de la contraseña es obligatoria.';
    }
    if (confirmacionPasswordControl.errors?.['pattern']) {
      return 'La confirmación de la contraseña debe contener exactamente 4 dígitos.';
    }
    if (confirmacionPasswordControl.value !== this.registroForm.controls['password'].value) {
      return 'Las contraseñas no coinciden.';
    }
    return 'Error desconocido en el campo de confirmación de contraseña.';
  }

  // Incrementar contador
  incrementarContador() {
    this.estadoService.incrementar();
  }
}

