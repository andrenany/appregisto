import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importamos el módulo para trabajar rutas de Angular
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { EstadoService } from '../../servicios/estado.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private estadoService: EstadoService, 
    public fb: FormBuilder, 
    private router: Router, 
    public alertController: AlertController
  ) {
    this.loginForm = this.fb.group({
      'usuario': new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(8)]),
      'password': new FormControl("", [Validators.required, Validators.pattern(/^\d{4}$/)])
    });
  }

  ngOnInit(): void {}

  // Ir a crear cuenta
  navigateToregistro() {
    this.router.navigate(['/registro']); // Navegamos hacia la página de registro
    this.estadoService.reiniciar(); 
  }

  async ingresar() {
    if (this.loginForm.invalid) {
      const errors = this.loginForm.controls;

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
    }

    const f = this.loginForm.value;
    const usuarioString = localStorage.getItem('usuario');
    const usuario = JSON.parse(usuarioString!); // Usa esto solo si estás seguro de que `usuarioString` no es `null`

    if (usuario && usuario.usuario === f.usuario && usuario.password === f.password) {
      this.router.navigate(['/home']); // Navegamos hacia la página principal
      this.estadoService.reiniciar();
    } else {
      const alert = await this.alertController.create({
        header: 'Datos Incorrectos',
        message: 'El nombre de usuario o la contraseña son incorrectos.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }

  // Funciones para obtener mensajes de error
  getUsuarioErrorMessage() {
    const usuarioControl = this.loginForm.controls['usuario'];
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
    const passwordControl = this.loginForm.controls['password'];
    if (passwordControl.errors?.['required']) {
      return 'La contraseña es obligatoria.';
    }
    if (passwordControl.errors?.['pattern']) {
      return 'La contraseña debe contener exactamente 4 dígitos.';
    }
    return 'Error desconocido en el campo de contraseña.';
  }

  reset(event: any) {
    // Implementa la lógica de reseteo aquí
  }
}
