from flask_sqlalchemy import SQLAlchemy



db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }

class Entidad(db.Model):

    __tablename__ = 'entidades' 
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(50), nullable=True)
    db.relationship('Partners', backref='entidad', lazy=True)  

    def __repr__(self):
        return f'<Entidad {self.tipo}>'
    def serialize(self):
        return {
            "id": self.id,
            "tipo": self.tipo  
        }

class Intereses(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), unique=True, nullable=False)
    descripcion = db.Column(db.String(120), nullable=True)

    def __repr__(self):
        return f'<Interes {self.nombre}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
        }

class Eventos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    fecha = db.Column(db.Date, nullable=True)
    hora_inicio = db.Column(db.Time, nullable=True)
    hora_fin = db.Column(db.Time, nullable=True) 
    direccion = db.Column(db.String(255), nullable=True) 
    latitud = db.Column(db.Float, nullable=True) 
    longitud= db.Column(db.Float, nullable=True) 
    breve_descripcion = db.Column(db.String(120), nullable=True)
    accesibilidad = db.Column(db.Boolean(), nullable=True)
    dificultad = db.Column(db.String(120), nullable=True)
    precio = db.Column(db.Integer, nullable=True)
    cupo = db.Column(db.Integer, nullable=True)
    observaciones = db.Column(db.String(120), nullable=True)
    foto_evento = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean(), default=True, nullable=False)
    partner_id = db.Column(db.Integer, db.ForeignKey('partners.id'), nullable=True)
    partner = db.relationship('Partners', backref='eventos', lazy=True)
    partner_nombre = db.Column(db.String(120), nullable=True)
    interes_id = db.Column(db.Integer, db.ForeignKey('intereses.id'), nullable=True)
    interes = db.relationship('Intereses', backref='eventos', lazy=True)

    def __repr__(self):
        return f'<Eventos {self.nombre}>'

    def serialize(self):
        meses = {
            1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril",
            5: "Mayo", 6: "Junio", 7: "Julio", 8: "Agosto",
            9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre"
        }
        
        if self.fecha is None:
            fecha_formateada = "Fecha no disponible"
        else:
            mes = meses[self.fecha.month]
            fecha_formateada = f"{self.fecha.day} de {mes} de {self.fecha.year}"

        return {
            "id": self.id,
            "nombre": self.nombre,
            "fecha": fecha_formateada,
            "horario": f"{self.hora_inicio.strftime('%H:%M')} - {self.hora_fin.strftime('%H:%M')}" if self.hora_inicio and self.hora_fin else "Horario no disponible",
            "direccion": self.direccion,
            "latitud": self.latitud,
            "longitud": self.longitud,
            "breve_descripcion": self.breve_descripcion,
            "accesibilidad": self.accesibilidad,
            "dificultad": self.dificultad,
            "precio": self.precio,
            "cupo": self.cupo,
            "observaciones": self.observaciones,
            "partner_id": self.partner_id,
            "partner_nombre": self.partner_nombre,
            "interes_id": self.interes_id,
            "interes_nombre": self.interes.nombre if self.interes else None 
        }

class Partners(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), unique=False, nullable=True)
    nif = db.Column(db.String(120), nullable=True)
    direccion = db.Column(db.String(255), nullable=True) 
    latitud = db.Column(db.Float, nullable=True) 
    longitud= db.Column(db.Float, nullable=True) 
    sector = db.Column(db.String(120), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean(), default=True, nullable=False)
    entidad_id = db.Column(db.Integer, db.ForeignKey('entidades.id'))
    tipo_entidad = db.relationship('Entidad')
    foto = db.Column(db.String(255), nullable=True)
    foto_perfil = db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return f'<Partners {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "nif": self.nif,
            "direccion": self.direccion,
            "latitud": self.latitud,
            "longitud": self.longitud,
            "sector": self.sector,
            "email": self.email,
            "entidad_id": self.entidad_id,
            # No serializamos la contraseña por seguridad
        }
    
class Usuarios(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=True)
    apellidos = db.Column(db.String(120), nullable=True)
    foto = db.Column(db.String(255), nullable=True)
    foto_perfil = db.Column(db.String(255), nullable=True)
    public_id_perfil = db.Column(db.String)
    fecha_nacimiento = db.Column(db.Date, nullable=True)  
    breve_descripcion = db.Column(db.String(255), nullable=True)  
    direccion = db.Column(db.String(255), nullable=True) 
    latitud = db.Column(db.Float, nullable=True) 
    longitud = db.Column(db.Float, nullable=True) 
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  
    is_active = db.Column(db.Boolean(), default=True, nullable=False)
    telefono = db.Column(db.String(20), nullable=True) 
    genero = db.Column(db.String(10), nullable=True)      

    db.relationship('Inscripciones', backref='usuarios', lazy=True)

    def __repr__(self):
        return f'<Usuario {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "apellidos": self.apellidos,
            "direccion": self.direccion,
            "latitud": self.latitud,
            "longitud": self.longitud,
            "fecha_nacimiento": self.fecha_nacimiento.strftime('%Y-%m-%d') if self.fecha_nacimiento else None,
            "breve_descripcion": self.breve_descripcion,
            "email": self.email,
            "telefono": self.telefono, 
            "genero": self.genero,   
            "is_active": self.is_active,
            "foto_perfil": self.foto_perfil, 
            "public_id_perfil": self.public_id_perfil
            # No serializamos la contraseña por seguridad
        }
    
class Imagenes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), nullable=False)  
    public_id = db.Column(db.String(255), nullable=False)  
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=True)
    partner_email = db.Column(db.String(120), db.ForeignKey('partners.email'), nullable=True)  # Relación basada en el email
    es_perfil = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<Imagen {self.url}>'
    
class Inscripciones(db.Model):

    __tablename__ = 'inscripciones'
    id = db.Column(db.Integer, primary_key=True)
    fecha_registro = db.Column(db.String(120), nullable=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'))
    usuario = db.relationship('Usuarios') 
    evento_id = db.Column(db.Integer, db.ForeignKey('eventos.id'))
    evento = db.relationship('Eventos')   

    def __repr__(self):
        return f'<Inscripcion {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "evento_id": self.evento_id,
            "fecha_registro": self.fecha_registro
        }

class UsuariosIntereses(db.Model):
    __tablename__ = 'usuarios_intereses'
    
    # Si decides conservar el id, puedes dejarlo aquí
    id = db.Column(db.Integer, primary_key=True)

    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    interes_id = db.Column(db.Integer, db.ForeignKey('intereses.id'), nullable=False)

    # Define las relaciones con las tablas Usuarios e Intereses
    usuario = db.relationship('Usuarios', backref=db.backref('usuarios_intereses', lazy=True))
    interes = db.relationship('Intereses', backref=db.backref('usuarios_intereses', lazy=True))

    def __repr__(self):
        return f'<UsuariosIntereses usuario_id={self.usuario_id}, interes_id={self.interes_id}>'

    def serialize(self):
        return {
            "usuario_id": self.usuario_id,
            "interes_id": self.interes_id
        }
