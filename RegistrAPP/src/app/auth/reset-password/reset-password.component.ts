import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  showVerifyButton: boolean = true; // Mostrar el botón de verificar
  showPasswordFields: boolean = false; // Mostrar campos de contraseña

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public alertController: AlertController
  ) {
    this.resetPasswordForm = this.fb.group({
      username: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {}


  //VERIFICAR USUARIO ANTES DE CAMBIAR CONTRASEÑA
// Función para obtener el usuario desde localStorage
getUsuarioFromLocalStorage(): any {
  const storedUsers = localStorage.getItem('usuarios');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  return null;
}

async verificarUsuario() {
  const username = this.resetPasswordForm.get('username')?.value;
  
  // Verificar si existe el usuario en localStorage
  const storedUser = localStorage.getItem('usuario');
  
  if (storedUser) {
    // Parsear el objeto almacenado en localStorage
    const usuario = JSON.parse(storedUser);
    
    // Comprobar si el nombre de usuario coincide
    if (usuario?.usuario === username) {
      // Usuario encontrado, mostrar campos de nueva contraseña
      this.showVerifyButton = false;
      this.showPasswordFields = true;
    } else {
      // Usuario no encontrado
      const alert = await this.alertController.create({
        header: 'Usuario no encontrado',
        message: 'No se encontró un usuario con ese nombre. Verifica e intenta nuevamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  } else {
    // No hay usuarios en localStorage
    const alert = await this.alertController.create({
      header: 'No hay usuarios registrados',
      message: 'No se encontraron usuarios registrados en el sistema.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}



async onSubmit() {
  const formData = this.resetPasswordForm.value;

  if (formData.new_password !== formData.confirm_password) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Las contraseñas no coinciden. Verifica e intenta nuevamente.',
      buttons: ['Aceptar']
    });
    await alert.present();
    return;
  }

  // Obtenemos el usuario desde localStorage usando la función
  const usuarios = this.getUsuarioFromLocalStorage();
  
  if (usuarios) {
    const usuarioIndex = usuarios.findIndex((usuario: any) => usuario.usuario === formData.username);

    if (usuarioIndex !== -1) {
      // Actualiza la contraseña del usuario
      usuarios[usuarioIndex].password = formData.new_password;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      const successAlert = await this.alertController.create({
        header: 'Éxito',
        message: 'Tu contraseña ha sido restablecida con éxito.',
        buttons: [{
          text: 'Aceptar',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }]
      });
      await successAlert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Usuario no encontrado',
        message: 'No se encontró un usuario con ese nombre.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  } else {
    const alert = await this.alertController.create({
      header: 'No hay usuarios registrados',
      message: 'No hay usuarios registrados en el sistema.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}

}
