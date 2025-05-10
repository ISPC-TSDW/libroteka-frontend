from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Datos de prueba
EMAIL = "admin1@admin.com"
PASSWORD = "Superusuario123!"

def test_login_usuario():
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

        # Esperar a que cargue la página de login
        print("Esperando que cargue el formulario de login...")
        wait.until(EC.presence_of_element_located((By.ID, "idE")))

        # Completar el campo de email
        print("Completando email...")
        email_input = driver.find_element(By.ID, "idE")
        email_input.send_keys(EMAIL)
        time.sleep(1)

        # Completar el campo de contraseña
        print("Completando contraseña...")
        password_input = driver.find_element(By.ID, "InputPassword")
        password_input.send_keys(PASSWORD)
        time.sleep(1)

        # Marcar checkbox Recordarme
        print("Marcando checkbox Recordarme...")
        checkbox = driver.find_element(By.ID, "Check")
        checkbox.click()
        time.sleep(1)

        # Hacer clic en el botón ACCEDER
        print("Haciendo clic en ACCEDER...")
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()
        time.sleep(5)

        # Verificar redirección al dashboard
        print("Verificando redirección...")
        current_url = driver.current_url
        if "/dashboard" in current_url:
            print("✅ Login exitoso. Redireccionado a:", current_url)
        else:
            print("❌ Login fallido. URL actual:", current_url)

        print("Test finalizado. El navegador permanecerá abierto durante 30 segundos para inspección.")
        time.sleep(30)  # Mantener el navegador abierto durante 30 segundos para inspección
        print("Cerrando navegador automáticamente después del tiempo de espera.")

    except KeyboardInterrupt:
        print("\nCerrando navegador...")
        driver.quit()
    except Exception as e:
        print("❌ Error durante la prueba:", e)
        driver.quit()

if __name__ == "__main__":
    test_login_usuario()
