export class CreateEstudianteDto {
  cedula: string;
  matricula: string;
  nombres: string;
  apellidos: string;
  curso: string;
  tipoSangre?: string;
  nombreRepresentante?: string;
  telefonoRepresentante?: string;
}
