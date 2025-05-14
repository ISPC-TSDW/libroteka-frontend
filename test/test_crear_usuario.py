from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import random
import string
import time
from faker import Faker # type: ignore

# Inicializar Faker
fake = Faker('es_AR')

def generar_contraseña_segura():
    # Definir los conjuntos de caracteres
    mayusculas = string.ascii_uppercase
    minusculas = string.ascii_lowercase
    numeros = string.digits
    especiales = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    
    # Asegurar al menos un carácter de cada tipo
    contraseña = [
        random.choice(mayusculas),
        random.choice(minusculas),
        random.choice(numeros),
        random.choice(especiales)
    ]
    
    # Completar hasta 12 caracteres con una mezcla aleatoria
    todos_caracteres = mayusculas + minusculas + numeros + especiales
    contraseña.extend(random.choice(todos_caracteres) for _ in range(8))
    
    # Mezclar los caracteres
    random.shuffle(contraseña)
    
    return ''.join(contraseña)

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
    password = generar_contraseña_segura()

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
        driver.get("http://localhost:4200/inicio")

        wait = WebDriverWait(driver, 10)
        time.sleep(2)

        # Hacer clic en el ícono de login desde la barra de navegación
        login_icon = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'a[routerlink="/login"]')))
        login_icon.click()
        boton_ingresar = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "a[routerlink='/login']")))
        boton_ingresar.click()
        wait.until(EC.url_contains("/login"))
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "a[routerlink='/create']")))
        boton_crear_cuenta = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "a[routerlink='/create']")))
        boton_crear_cuenta.click()
        wait.until(EC.url_contains("/create"))
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[formControlName='username']")))
        datos = generar_datos_reales()
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[formControlName='username']"))).send_keys(datos['username'])
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[formControlName='first_name']")))

        driver.find_element(By.CSS_SELECTOR, "input[formControlName='first_name']").send_keys(datos['first_name'])
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[formControlName='last_name']")))

        driver.find_element(By.CSS_SELECTOR, "input[formControlName='last_name']").send_keys(datos['last_name'])
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[formControlName='dni']")))

        driver.find_element(By.CSS_SELECTOR, "input[formControlName='dni']").send_keys(datos['dni'])
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[formControlName='email']")))

        driver.find_element(By.CSS_SELECTOR, "input[formControlName='email']").send_keys(datos['email'])
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[formControlName='password']")))

        driver.find_element(By.CSS_SELECTOR, "input[formControlName='password']").send_keys(datos['password'])
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[formControlName='confirmpass']")))

        driver.find_element(By.CSS_SELECTOR, "input[formControlName='confirmpass']").send_keys(datos['password'])
        time.sleep(4)
        
        # Marcar el checkbox usando JavaScript
        checkbox = wait.until(EC.presence_of_element_located((By.ID, "Check")))
        driver.execute_script("arguments[0].checked = true;", checkbox)
        time.sleep(1)

        # Hacer click en el botón de enviar
        boton_enviar = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']")))
        driver.execute_script("arguments[0].click();", boton_enviar)
        time.sleep(1)

        wait.until(EC.url_contains("/success"))  # Replace "/success" with the actual URL or condition to wait for
        timeout = 60  # Tiempo en segundos antes de cerrar el navegador automáticamente
        for _ in range(timeout):
            time.sleep(1)
 
        driver.quit()

    except KeyboardInterrupt:

        driver.quit()
    except Exception as e:

        driver.quit()

if __name__ == "__main__":
    test_crear_usuario()
