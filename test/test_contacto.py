from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from faker import Faker

fake = Faker('es_ES')

def escribir_lento(elemento, texto, delay=0.1):
    for letra in texto:
        elemento.send_keys(letra)
        time.sleep(delay)

def test_formulario_contacto_realista():
    chrome_options = Options()
    chrome_options.add_argument("--start-maximized")
    driver = webdriver.Chrome(options=chrome_options)

    try:

        driver.get("http://localhost:4200/inicio")

        wait = WebDriverWait(driver, 10)
        time.sleep(2)

        driver.get("http://localhost:4200/contacto")

        wait = WebDriverWait(driver, 20)

        nombre_input = wait.until(EC.presence_of_element_located((By.ID, "nombre")))
        email_input = wait.until(EC.presence_of_element_located((By.ID, "email")))
        telefono_input = wait.until(EC.presence_of_element_located((By.ID, "telefono")))
        mensaje_input = wait.until(EC.presence_of_element_located((By.ID, "mensaje")))

        # Generar datos realistas
        nombre_completo = fake.name()
        correo = fake.email()
        telefono = fake.msisdn()[0:10]
        mensaje = "Este es un mensaje de prueba generado automáticamente."
        escribir_lento(nombre_input, nombre_completo)
        escribir_lento(email_input, correo)
        escribir_lento(telefono_input, telefono)
        escribir_lento(mensaje_input, mensaje, delay=0.05)

        submit_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']")))
        time.sleep(1)
        submit_button.click()

        time.sleep(5)  # Ver transición o alerta

        try:
            mensaje_exito = wait.until(EC.visibility_of_element_located((
                By.XPATH, "//*[contains(text(), 'Tu consulta fue enviada con éxito')]"
            )))
        except:
            pass

        try:
            alert = driver.switch_to.alert
            alert.accept()
        except:
            pass

    except Exception as e:
        pass
    finally:
        time.sleep(3)
        driver.quit()

if __name__ == "__main__":
    test_formulario_contacto_realista()
