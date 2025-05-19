## **Transcripción Automática de Videos con GitHub Actions y Extensión de Chrome**

**¡Convierte tus videos en texto de forma rápida y sencilla!** Este repositorio te ofrece dos métodos para transcribir tus videos:

* **Ejecución automática con GitHub Actions:** Sube tu video a un repositorio y GitHub Actions se encargará de todo el proceso de transcripción.
* **Extensión de Chrome:** Instala la extensión para transcribir videos directamente desde tu navegador.

### **Cómo comenzar**

#### **Método 1: GitHub Actions**
1.  **Forkea este repositorio:** Crea una copia personal de este repositorio en tu cuenta de GitHub.
2.  **Edita `video.txt`:** Reemplaza la URL de ejemplo en `video.txt` con la URL del video que deseas transcribir.
3.  **Personaliza el workflow (opcional):** Si necesitas ajustar la configuración, edita el archivo `github/workflows/main.yml`.
4.  **Sube los cambios:**
    ```bash
    git commit -m "Agrego mi video"
    git push
    ```
    GitHub Actions se activará automáticamente y comenzará el proceso de transcripción. El resultado se guardará en la rama `output`.

#### **Método 2: Extensión de Chrome**
1.  **Clona el repositorio:** Descarga una copia de este repositorio a tu computadora.
2.  **Abre la carpeta de la extensión:** Navega a la carpeta `chrome_extension` dentro del repositorio clonado.
3.  **Carga la extensión en Chrome:**
      * Abre Chrome y ve a `chrome://extensions/`.
      * Activa el modo desarrollador (el interruptor en la esquina superior derecha).
      * Haz clic en "Cargar extensión descomprimida" y selecciona la carpeta `chrome_extension`.

### **Estructura del Repositorio**

.
├── .gitignore
├── app.js
├── chrome_extension
├── node_modules
├── output.txt
├── package.json
├── screenshots
├── video.txt
└── github
└── workflows
└── main.yml

**Este bloque de código muestra la estructura de directorios y archivos del proyecto.**

### **Personalización**

* **Servicio de transcripción:** Puedes cambiar el servicio de transcripción utilizado modificando el código en `app.js` o en el workflow.
* **Formato de salida:** Puedes ajustar el formato de salida de la transcripción (por ejemplo, `.txt`, `.srt`).

### **Contribuciones**

¡Tus contribuciones son bienvenidas\! Reporta problemas, sugiere mejoras o crea nuevas funcionalidades.

### **Licencia**

Este proyecto está licenciado bajo la [MIT License](https://opensource.org/licenses/MIT).

**¿Qué significa esto?**

En resumen, la licencia MIT te otorga amplios permisos para utilizar, modificar y distribuir este software, incluso con fines comerciales, siempre y cuando incluyas esta misma notificación de licencia en tu distribución.

**Para una explicación más detallada, consulta el archivo LICENSE.**
