import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  usuarioVerificado: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public alertController: AlertController,
    private modalController: ModalController // Agregado para manejar el modal
  ) {
    this.resetForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]],
      nuevaPassword: ['', [Validators.required, Validators.minLength(4)]],
      confirmacionPassword: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit() {}

  async verificarUsuario() {
    const f = this.resetForm.value;
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');

    if (usuarioGuardado && f.usuario === usuarioGuardado.usuario) {
      this.usuarioVerificado = true;

      const successAlert = await this.alertController.create({
        header: 'Usuario verificado',
        message: 'El usuario ha sido verificado correctamente.',
        buttons: ['Aceptar']
      });

      await successAlert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Usuario no encontrado o incorrecto.',
        buttons: ['Aceptar']
      });

      await alert.present();
    }
  }

  async guardarNuevaPassword() {
    const f = this.resetForm.value;

    if (!this.usuarioVerificado) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Primero verifica el usuario antes de cambiar la contraseña.',
        buttons: ['Aceptar']
      });

      await alert.present();
      return;
    }

    if (this.resetForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Debes llenar todos los datos correctamente.',
        buttons: ['Aceptar']
      });

      await alert.present();
      return;
    }

    if (f.nuevaPassword !== f.confirmacionPassword) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Las contraseñas no coinciden.',
        buttons: ['Aceptar']
      });

      await alert.present();
      return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    
    if (usuario) {
      usuario.password = f.nuevaPassword;
      localStorage.setItem('usuario', JSON.stringify(usuario));

      const successAlert = await this.alertController.create({
        header: 'Contraseña actualizada',
        message: 'Tu contraseña ha sido actualizada con éxito.',
        buttons: [{
          text: 'Aceptar',
          handler: async () => {
            await this.modalController.dismiss(); // Cierra el modal
            this.router.navigate(['/login']);
          }
        }]
      });

      await successAlert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se encontró el usuario para actualizar la contraseña.',
        buttons: ['Aceptar']
      });

      await alert.present();
    }
  }
}
