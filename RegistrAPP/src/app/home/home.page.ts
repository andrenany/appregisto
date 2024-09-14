import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importamos el módulo para trabajar rutas de Angular
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  contador: number = 0; // Variable para el contador

  constructor(
    private estadoService: EstadoService,
    public fb: FormBuilder,
    private router: Router,
    public alertController: AlertController
  ) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nivelEducacion: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    });
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

  navigateTologin() {
    this.router.navigate(['/login']); // Navegamos hacia la página del detalle
  }

  // Método para navegar hacia atrás
  navigateBack() {
    this.router.navigate(['../']); // Navega hacia la página anterior o raíz
  }

  // Método para abrir el escáner (aquí se puede integrar un escáner QR si se añade)
  openScanner() {
    console.log('Método openScanner llamado');
    // Aquí deberías implementar la funcionalidad para abrir el escáner
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

  // Funciones del servicio
  ionViewWillEnter() {
    console.log('Se ejecuta antes de que la vista se muestre');
    console.log('ionViewWillEnter', this.contador);
  }

  ionViewDidEnter() {
    console.log('Se ejecuta cuando la vista haya sido completamente cargada');
    console.log('ionViewDidEnter', this.contador);
  }

  ionViewWillLeave() {
    console.log('Se ejecuta cuando la vista está a punto de desaparecer');
    console.log('ionViewWillLeave', this.contador);
  }

  ionViewDidLeave() {
    console.log('Se ejecuta cuando la vista ya desapareció');
    console.log('ionViewDidLeave', this.contador);
  }

  ngOnDestroy() {
    console.log('Se ejecuta cuando la vista está a punto de ser destruida');
    console.log('ngOnDestroy', this.contador);
  }

  // Métodos para incrementar el contador
  incrementarContador() {
    this.estadoService.incrementar();
  }

  // Navegar hacia otra página
  navegarAOtraPagina() {
    this.router.navigate(['/otra-pagina']);
    this.estadoService.reiniciar();
  }
}
