import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { EstadoService } from '../../servicios/estado.service';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

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
    public alertController: AlertController,
    private modalController: ModalController
  ) {
    this.loginForm = this.fb.group({
      'usuario': new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(8)]),
      'password': new FormControl("", [Validators.required, Validators.pattern(/^\d{4}$/)]),
    });
  }

  ngOnInit(): void {}

  navigateToregistro() {
    this.router.navigate(['/registro']);
    this.estadoService.reiniciar();
  }

  async ingresar() {
    if (this.loginForm.valid) {
      const f = this.loginForm.value;
      const usuarioString = localStorage.getItem('usuario');

      if (!usuarioString) {
        await this.presentAlert('Error', 'No hay usuarios registrados');
        return;
      }

      const usuario = JSON.parse(usuarioString);

      if (usuario.usuario === f.usuario && usuario.password === f.password) {
        this.router.navigate(['/home']);
        this.estadoService.reiniciar();
      } else {
        await this.presentAlert('Datos incorrectos', 'Nombre de usuario o contraseña incorrectos');
      }
    } else {
      await this.presentAlert('Formulario inválido', 'Por favor, completa todos los campos correctamente');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  async openResetPassword() {
    const modal = await this.modalController.create({
      component: ResetPasswordComponent
    });
    return await modal.present();
  }
}