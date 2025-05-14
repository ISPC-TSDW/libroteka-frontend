from selenium import webdriver 
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from faker import Faker

EMAIL = "admin1@admin.com"
PASSWORD = "Superusuario123!"
fake = Faker()

def test_agregar_y_comprar_libro():
    chrome_options = Options()
    chrome_options.add_argument("--start-maximized")
    driver = webdriver.Chrome(options=chrome_options)

    try:
        wait = WebDriverWait(driver, 10)

        # Ir a la página de inicio
        driver.get("http://localhost:4200/inicio")
        time.sleep(2)

        # Clic en login
        login_icon = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'a[routerlink="/login"]')))
        login_icon.click()

        # Completar login
        wait.until(EC.presence_of_element_located((By.ID, "idE"))).send_keys(EMAIL)
        time.sleep(0.5)
        driver.find_element(By.ID, "InputPassword").send_keys(PASSWORD)
        time.sleep(0.5)
        driver.find_element(By.ID, "Check").click()
        time.sleep(0.5)
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(1)

        # Esperar redirección
        wait.until(EC.url_contains("/dashboard"))

        # Volver a inicio
        inicio_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'a[routerlink="/inicio"]')))
        inicio_btn.click()

        # Esperar sección de libros destacados
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "featured-section")))

        # Scroll hacia la sección
        driver.execute_script("document.querySelector('.featured-section').scrollIntoView({behavior: 'smooth'});")
        time.sleep(2)

        # Buscar "El Hobbit"
        book_cards = driver.find_elements(By.CSS_SELECTOR, ".book-card")
        found = False
        for card in book_cards:
            title_element = card.find_element(By.CSS_SELECTOR, ".book-title")
            if "El hobbit" in title_element.text:
                add_button = card.find_element(By.XPATH, ".//button[contains(text(),'Añadir al carrito')]")
                add_button.click()
                found = True
                break

        if not found:
            driver.quit()
            return

        time.sleep(2)

        # Subir al inicio de la página
        driver.execute_script("window.scrollTo(0, 0);")
        time.sleep(1)

        # Hacer clic en el ícono del carrito
        carrito_icon = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button.carrito-icon")))
        carrito_icon.click()
        time.sleep(1)

        # Hacer clic en "Iniciar compra"
        iniciar_compra_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Iniciar compra')]")))
        iniciar_compra_btn.click()

        # Esperar a que cargue el formulario de dirección
        wait.until(EC.presence_of_element_located((By.ID, "city")))

        # Completar con datos aleatorios
        city = fake.city()
        address = fake.street_address()
        telephone = fake.phone_number()

        driver.find_element(By.ID, "city").send_keys(city)
        time.sleep(0.5)
        driver.find_element(By.ID, "address").send_keys(address)
        time.sleep(0.5)
        driver.find_element(By.ID, "telephone").send_keys(telephone)
        time.sleep(2)

        # Enviar formulario de dirección
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()

        # Esperar formulario de pago
        wait.until(EC.presence_of_element_located((By.ID, "cardNumber")))

        # Completar datos de pago aleatorios
        card_number = "4111111111111111"
        expiry_date = "12/27"
        cvv = "123"
        card_holder = fake.name()


        driver.find_element(By.ID, "cardNumber").send_keys(card_number)
        time.sleep(0.5)
        driver.find_element(By.ID, "expiryDate").send_keys(expiry_date)
        time.sleep(0.5)
        driver.find_element(By.ID, "cvv").send_keys(cvv)
        time.sleep(0.5)
        driver.find_element(By.ID, "cardHolderName").send_keys(card_holder)
        time.sleep(2)

        # Enviar formulario de pago
        pagar_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        pagar_button.click()

        time.sleep(5)

    except Exception as e:
        pass
    finally:
        time.sleep(3)
        driver.quit()

if __name__ == "__main__":
    test_agregar_y_comprar_libro()
