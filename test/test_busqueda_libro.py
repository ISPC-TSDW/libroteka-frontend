from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def test_busqueda_libro_y_ver_detalle():
    chrome_options = Options()
    chrome_options.add_argument("--start-maximized")
    driver = webdriver.Chrome(options=chrome_options)

    try:
        driver.get("http://localhost:4200/inicio")

        wait = WebDriverWait(driver, 10)
        time.sleep(2)
    
        driver.get("http://localhost:4200/busqueda-personalizada")
        wait = WebDriverWait(driver, 10)

        search_input = wait.until(EC.presence_of_element_located((By.ID, "search-input")))

        criterio_select = driver.find_element(By.ID, "search-filter")
        criterio_select.click()
        time.sleep(1)
        for option in criterio_select.find_elements(By.TAG_NAME, 'option'):
            if option.get_attribute("value") == "title":
                option.click()
                break

        termino_busqueda = "Cien años de soledad"
        print(f"Ingresando término: {termino_busqueda}")
        search_input.send_keys(termino_busqueda)
        time.sleep(2)

        search_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        search_button.click()
        time.sleep(2)

        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".book")))
        resultados = driver.find_elements(By.CSS_SELECTOR, ".book")

        print(f"Se encontraron {len(resultados)} resultados.")
        for idx, libro in enumerate(resultados, start=1):
            print(f"\nLibro {idx}:\n{libro.text}")
            

        ver_detalle_button = resultados[0].find_element(By.XPATH, ".//button[contains(text(), 'Ver detalles')]")
        ver_detalle_button.click()
        print("Se hizo clic en 'Ver detalles'.")

        popup_visible = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".popup-overlay")))

    except Exception as e:
        print("Error durante el test:", str(e))
    finally:
        driver.quit()

if __name__ == "__main__":
    test_busqueda_libro_y_ver_detalle()
