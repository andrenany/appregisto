import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';//importamos el modulo para trabajar rutas de angular
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

  constructor(private estadoService: EstadoService, public fb: FormBuilder, private router: Router, public alertController: AlertController ) {
    this.loginForm = this.fb.group({
      'usuario': new FormControl("",[Validators.required, Validators.minLength(3), Validators.maxLength(8)]),
      'password': new FormControl("",[Validators.required, Validators.pattern(/^\d{4}$/)])
    })
  }

  ngOnInit(): void {}
    //ir a crear cuenta

    navigateToregistro(){
      this.router.navigate(['/registro']);//con esta linea navegamos hacia la página del detalle
      this.estadoService.reiniciar(); 
    }

  async ingresar(){
    var f=this.loginForm.value;

    var usuarioString = localStorage.getItem('usuario');
    var usuario = JSON.parse(usuarioString!); // Usa esto solo si estás seguro de que `usuarioString` no es `null`


    if(usuario.usuario==f.usuario && usuario.password ==f.password){
      
      this.router.navigate(['/home']);//con esta linea navegamos hacia la página del detalle
      this.estadoService.reiniciar();
    }else{
      const alert = await this.alertController.create({
        header: 'Datos incorrectos',
         message: 'nombre o usuario incorrecto',
         buttons: ['Aceptar']
        });
  
        await alert.present();
        return;
    }

  }

  reset(event: any) {
    // Implementa la lógica de reseteo aquí
  }

 
  
}