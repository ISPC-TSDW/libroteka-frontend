from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import random
import string
import time
from datetime import datetime
from faker import Faker # type: ignore

# Inicializar Faker
fake = Faker('es_AR')

def guardar_datos_usuario(datos):
    fecha_hora = datetime.now().strftime("%Y%m%d_%H%M%S")
    nombre_archivo = f"usuario_creado_{fecha_hora}.txt"

    contenido = f"""Datos del usuario creado:
Fecha y hora: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

Información Personal:
-------------------
Nombre de Usuario: {datos['username']}
Nombre: {datos['first_name']}
Apellido: {datos['last_name']}
DNI: {datos['dni']}
Email: {datos['email']}

Información de Inicio de Sesión:
------------------------------
Contraseña: {datos['password']}
"""

    with open(nombre_archivo, 'w', encoding='utf-8') as archivo:
        archivo.write(contenido)

    print(f"\nDatos del usuario guardados en el archivo: {nombre_archivo}")

def generar_datos_reales():
    first_name = fake.first_name()
    last_name = fake.last_name()

   # Limitar la longitud del nombre de usuario a 18 caracteres como máximo
    base_username = f"{first_name.lower()}.{last_name.lower()}"
    max_length = 18
    suffix = str(random.randint(1, 99))

    # Cortar el base_username si supera el largo permitido al sumarle el sufijo
    max_base_length = max_length - len(suffix)
    if len(base_username) > max_base_length:
        base_username = base_username[:max_base_length]

    username = f"{base_username}{suffix}"

    dni = str(random.randint(100000, 999999))  # DNI de 6 caracteres
    email = fake.email()
    password = fake.password(length=10, special_chars=True, digits=True, upper_case=True, lower_case=True)

    return {
        'username': username,
        'first_name': first_name,
        'last_name': last_name,
        'dni': dni,
        'email': email,
        'password': password
    }

def test_crear_usuario():
    chrome_options = Options()
    chrome_options.add_argument("--start-maximized")

    driver = webdriver.Chrome(options=chrome_options)

    try:
        print("Abriendo página de inicio...")
        driver.get("http://localhost:4200/inicio")

        wait = WebDriverWait(driver, 10)
        time.sleep(2)

        # Hacer clic en el ícono de login desde la barra de navegación
        print("Haciendo clic en el ícono/login en la barra de navegación...")
        login_icon = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'a[routerlink="/login"]')))
        login_icon.click()

        print("Haciendo clic en el botón INGRESAR...")
        boton_ingresar = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "a[routerlink='/login']")))
        boton_ingresar.click()
        wait.until(EC.url_contains("/login"))
        time.sleep(4)

        print("Haciendo clic en el botón CREAR CUENTA...")
        boton_crear_cuenta = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "a[routerlink='/create']")))
        boton_crear_cuenta.click()
        wait.until(EC.url_contains("/create"))
        time.sleep(4)

        print("Generando datos realistas...")
        datos = generar_datos_reales()

        print("Llenando el formulario...")
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[formControlName='username']"))).send_keys(datos['username'])
        time.sleep(4)

        driver.find_element(By.CSS_SELECTOR, "input[formControlName='first_name']").send_keys(datos['first_name'])
        time.sleep(4)

        driver.find_element(By.CSS_SELECTOR, "input[formControlName='last_name']").send_keys(datos['last_name'])
        time.sleep(4)

        driver.find_element(By.CSS_SELECTOR, "input[formControlName='dni']").send_keys(datos['dni'])
        time.sleep(4)

        driver.find_element(By.CSS_SELECTOR, "input[formControlName='email']").send_keys(datos['email'])
        time.sleep(4)

        driver.find_element(By.CSS_SELECTOR, "input[formControlName='password']").send_keys(datos['password'])
        time.sleep(4)

        driver.find_element(By.CSS_SELECTOR, "input[formControlName='confirmpass']").send_keys(datos['password'])
        time.sleep(4)

        print("Marcando checkbox de boletín...")
        driver.find_element(By.CSS_SELECTOR, "input[type='checkbox']").click()
        time.sleep(4)

        guardar_datos_usuario(datos)
        time.sleep(4)

        print("Enviando formulario...")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(5)

        print("Test completado. El navegador permanecerá abierto por un tiempo limitado.")
        timeout = 60  # Tiempo en segundos antes de cerrar el navegador automáticamente
        for _ in range(timeout):
            time.sleep(1)
        print("Tiempo de espera agotado. Cerrando el navegador automáticamente.")
        driver.quit()

    except KeyboardInterrupt:
        print("\nCerrando el navegador...")
        driver.quit()
    except Exception as e:
        print(f"Ocurrió un error: {e}")
        driver.quit()

if __name__ == "__main__":
    test_crear_usuario()
