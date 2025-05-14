from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import random
import string
import time
from datetime import datetime
from faker import Faker

# Inicializar Faker
fake = Faker('es_AR')

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
    email = "usuarioinvalido.com"  # Email sin @
    password = "12345678"  # Contraseña débil

    return {
        'username': username,
        'first_name': first_name,
        'last_name': last_name,
        'dni': dni,
        'email': email,
        'password': password
    }

def test_registro_fallido_email_y_password():
    chrome_options = Options()
    chrome_options.add_argument("--start-maximized")
    
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        driver.get("http://localhost:4200/inicio")

        wait = WebDriverWait(driver, 10)
        time.sleep(2)

        login_icon = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'a[routerlink="/login"]')))
        login_icon.click()

        boton_ingresar = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "a[routerlink='/login']")))
        boton_ingresar.click()
        wait.until(EC.url_contains("/login"))
        time.sleep(2)

        boton_crear_cuenta = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "a[routerlink='/create']")))
        boton_crear_cuenta.click()
        wait.until(EC.url_contains("/create"))
        time.sleep(2)

        datos = generar_datos_reales()

        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[formControlName='username']"))).send_keys(datos['username'])
        time.sleep(1)

        driver.find_element(By.CSS_SELECTOR, "input[formControlName='first_name']").send_keys(datos['first_name'])
        time.sleep(1)

        driver.find_element(By.CSS_SELECTOR, "input[formControlName='last_name']").send_keys(datos['last_name'])
        time.sleep(1)

        driver.find_element(By.CSS_SELECTOR, "input[formControlName='dni']").send_keys(datos['dni'])
        time.sleep(1)
        
        driver.find_element(By.CSS_SELECTOR, "input[formControlName='email']").send_keys(datos['email'])
        time.sleep(1)

        driver.find_element(By.CSS_SELECTOR, "input[formControlName='password']").send_keys(datos['password'])
        time.sleep(1)

        driver.find_element(By.CSS_SELECTOR, "input[formControlName='confirmpass']").send_keys(datos['password'])
        time.sleep(1)

        checkbox = wait.until(EC.presence_of_element_located((By.ID, "Check")))
        driver.execute_script("arguments[0].checked = true;", checkbox)
        time.sleep(1)

        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(3)

        try:
            mensaje_error_email = wait.until(EC.visibility_of_element_located((
                By.XPATH, "//*[contains(text(), 'email inválido')]"
            )))
        except:
            raise AssertionError("No se mostró el mensaje de 'email inválido'.")

        try:
            mensaje_error_password = wait.until(EC.visibility_of_element_located((
                By.XPATH, "//*[contains(text(), 'La contraseña debe tener al menos 8 caracteres')]"
            )))
        except:
            raise AssertionError("No se mostró el mensaje de error de contraseña débil.")

    except Exception as e:
        raise e
    finally:
        input("Presiona Enter para cerrar el navegador...")
        driver.quit()

if __name__ == "__main__":
    test_registro_fallido_email_y_password()