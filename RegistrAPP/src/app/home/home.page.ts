import { Component } from '@angular/core';
import { Router } from '@angular/router';//importamos el modulo para trabajar rutas de angular
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { EstadoService } from '../servicios/estado.service';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  usuario: any;
  formulario: FormGroup;
  showCalendar: boolean = false;
  contador: number = 0; ///variable para el contador


  constructor(private estadoService: EstadoService, public fb: FormBuilder, private router: Router, public alertController: AlertController ) { 
    
    
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nivelEducacion: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]});
      this.usuario = localStorage.getItem('f.usuario'); 
  }

  ngOnInit() {
    // Llamamos a la función que obtiene el usuario del localStorage
    this.usuario = this.getUsuarioFromLocalStorage();
    
    // Mensaje de consola para depuración
    console.log('ngOnInit el componente se ha inicializado');
    
    // Suscribirse al observable para recibir actualizaciones de la variable
    this.estadoService.contadorActual.subscribe(valor => {
      this.contador = valor;
      console.log('ngOnInit Contador Actualizado', this.contador);
    });
  }
  
  
  limpiar() {
    this.formulario.reset();
  }
  navigateTologin(){
    this.router.navigate(['/login']);//con esta linea navegamos hacia la página del detalle
  }


  
  // Función para obtener los datos del usuario desde el localStorage
  getUsuarioFromLocalStorage() {
    const usuarioString = localStorage.getItem('usuario');
    return usuarioString ? JSON.parse(usuarioString) : null;
  }



  async mostrar() {
    const formData = this.formulario.value;

    const alert = await this.alertController.create({
      header: 'Datos Ingresados',
      message: `Nombre: ${formData.nombre}\nApellido: ${formData.apellido}\nNivel Educación: ${formData.nivelEducacion}\nFecha Nacimiento: ${formData.fechaNacimiento}`,
      buttons: ['Aceptar']
    });
    

    await alert.present();
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar; // Alterna la visibilidad del calendario
  }

  //funciones de servicio

   ///se va a ejecutar justo antes de que la visa se muestre 
   ionViewWillEnter(){
    console.log('se ejecuta antes que la vista se muestre');
    console.log('ionViewWillEnter', this.contador);
  }

  ionViewDidEnter(){
    console.log('se ejecuta cuando la vista haya sido completamente cargada');
    console.log('ionViewDidEnter', this.contador);
  }

  ionViewWillLeave(){
    console.log('se ejecuta cuando la vista esta apunto de desaparecer');
    console.log('ionViewWillLeave', this.contador);
  }
  ionViewDidLeave(){
    console.log('se ejecuta cuando la vista ya desaparecio');
    console.log('ionViewDidLeave', this.contador);
  }
  ngOnDestroy(){
    console.log('se ejecuta cuando la vista esta a punto de ser destruido');
    console.log('ngOnDestroy', this.contador);
  }

  //METODOS PARA 

  //INCREMERTAR
  incrementarContador(){
    this.estadoService.incrementar();
  }
 
  //NAVEGAR HACIA OTRA PAGINA
  navegarAOtraPagina(){
    this.router.navigate(['/otra-pagina']);
    this.estadoService.reiniciar();
  }

}


