import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SucursalService } from '../../service/sucursal.service';
import { MonedaService } from '../../service/moneda.service';
import { Sucursal } from '../../models/sucursal.model';
import { Moneda } from '../../models/moneda.model';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';


import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzSpaceModule,
    NzDatePickerModule,
    NzPaginationModule
  ],
})
export class SucursalesComponent implements OnInit {
  currentSortKey: string | null = null;
  currentSortDirection: 'ascend' | 'descend' | null = null;
  sucursalesOriginal: Sucursal[] = []; 
  sucursales: Sucursal[] = [];         
  monedas: Moneda[] = [];
  visibleModal = false;
  form!: FormGroup;
  sucursalSeleccionada?: Sucursal;
  total = 0; 
  pageSize = 5; 
  pageIndex = 1; 

  constructor(
    private sucursalService: SucursalService,
    private monedaService: MonedaService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarSucursales();
    this.cargarMonedas();
  }

  initForm() {
    this.form = this.fb.group({
      id: [null],
      codigo: [null],
      descripcion: ['', [Validators.required, Validators.maxLength(250)]],
      direccion: ['', [Validators.required, Validators.maxLength(250)]],
      identificacion: ['', [Validators.required, Validators.maxLength(50)]],
      fechaCreacion: [null, [Validators.required, this.fechaValidator()]],
      IdMoneda: [null, Validators.required]
    });
  }

  onQueryParamsChange(params: {
    pageSize: number;
    pageIndex: number;
    sort: Array<{ key: string; value: string | null }>;
  }) {
    const { pageSize, pageIndex, sort } = params;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
  
    const activeSort = sort.find(s => s.value !== null);
    console.log('activeSort:', activeSort);
  
    if (activeSort) {
      const key = activeSort.key as keyof Sucursal;
  
      this.sucursalesOriginal = [...this.sucursalesOriginal].sort((a, b) => {
        let aValue = a[key];
        let bValue = b[key];
  
        if (key === 'fechaCreacion') {
          aValue = new Date(aValue as string).getTime();
          bValue = new Date(bValue as string).getTime();
        }
  
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return activeSort.value === 'ascend' ? aValue - bValue : bValue - aValue;
        }
  
        return activeSort.value === 'ascend'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }
  
    this.loadData();
  }
  onSortChange(event: { key: keyof Sucursal, value: 'ascend' | 'descend' | null }): void {
    const { key, value } = event;
  
    if (key && value) {
      this.sucursales = [...this.sucursalesOriginal].sort((a, b) => {
        let aValue = a[key];
        let bValue = b[key];
  

        if (key === 'fechaCreacion') {

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
          } else {

            return 0;
          }
        }
  

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return value === 'ascend' ? aValue - bValue : bValue - aValue;
        }
  

        return value === 'ascend'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
  
      this.loadData(); 
    }
  }
  



  loadData(): void {
    const start = (this.pageIndex - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.sucursales = this.sucursalesOriginal.slice(start, end);
  }
  
  abrirModal(sucursal?: Sucursal): void {
    this.sucursalSeleccionada = sucursal;

    if (sucursal) {
      this.form.patchValue({
        ...sucursal,
        fechaCreacion: new Date(sucursal.fechaCreacion)
      });
    } else {
      this.form.reset();
    }

    this.visibleModal = true;
  }

  cerrarModal(): void {
    this.visibleModal = false;
    this.form.reset();
    this.sucursalSeleccionada = undefined;
  }

  guardarSucursal(): void {
    if (this.form.invalid) return;

    const data = this.form.value as Sucursal;

    if (this.sucursalSeleccionada) {
      this.sucursalService.update(data).subscribe({
        next: () => {
          this.toastr.success('Sucursal actualizada');
          this.cargarSucursales();
          this.cerrarModal();
        },
        error: () => this.toastr.error('Error al actualizar')
      });
    } else {
      this.sucursalService.create(data).subscribe({
        next: () => {
          this.toastr.success('Sucursal creada');
          this.cargarSucursales();
          this.cerrarModal();
        },
        error: () => this.toastr.error('Error al crear')
      });
    }
  }

  eliminar(id: number): void {
    this.sucursalService.delete(id).subscribe({
      next: () => {
        this.toastr.success('Sucursal eliminada');
        this.cargarSucursales();
      },
      error: () => this.toastr.error('No se pudo eliminar')
    });
  }


  cargarSucursales(): void {
    this.sucursalService.getAll().subscribe({
      next: (data) => {
        this.sucursalesOriginal = data;     
        this.total = data.length;           
        this.loadData();                    
      },
      error: () => this.toastr.error('Error al cargar sucursales')
    });
  }
  
  cargarMonedas(): void {
    this.monedaService.getMonedas().subscribe({
      next: (data) => (this.monedas = data),
      error: () => this.toastr.error('Error al cargar monedas')
    });
  }

  fechaValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return null;

      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return selectedDate < today ? { invalidDate: true } : null;
    };
  }
}
