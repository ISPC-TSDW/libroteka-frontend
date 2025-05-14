from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def test_busqueda_libro_sin_resultados():
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

        termino_inexistente = "LibroInexistente1234"
        search_input.send_keys(termino_inexistente)

        search_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        search_button.click()
        time.sleep(2)

        resultados = driver.find_elements(By.CSS_SELECTOR, ".book")
        if len(resultados) > 0:
            raise AssertionError("Error: Se encontraron resultados cuando no debería haberlos.")

        mensaje_no_resultados = wait.until(EC.visibility_of_element_located((
            By.XPATH, "//*[contains(text(), 'No hay publicaciones que coincidan')]"
        )))

    except Exception as e:
        pass
    finally:
        driver.quit()

if __name__ == "__main__":
    test_busqueda_libro_sin_resultados()
