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
        print("Abriendo página de inicio...")
        driver.get("http://localhost:4200/inicio")
        wait = WebDriverWait(driver, 10)
        time.sleep(2)

        print("Navegando a la página de búsqueda personalizada...")
        driver.get("http://localhost:4200/busqueda-personalizada")
        wait = WebDriverWait(driver, 10)

        print("Esperando el input de búsqueda...")
        search_input = wait.until(EC.presence_of_element_located((By.ID, "search-input")))

        print("Seleccionando criterio de búsqueda...")
        criterio_select = driver.find_element(By.ID, "search-filter")
        criterio_select.click()
        time.sleep(1)
        for option in criterio_select.find_elements(By.TAG_NAME, 'option'):
            if option.get_attribute("value") == "title":
                option.click()
                break

        termino_inexistente = "LibroInexistente1234"
        print(f"Ingresando término de búsqueda sin resultados: {termino_inexistente}")
        search_input.send_keys(termino_inexistente)

        print("Haciendo clic en el botón de búsqueda...")
        search_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        search_button.click()
        time.sleep(2)

        print("Verificando que no aparezcan resultados...")
        resultados = driver.find_elements(By.CSS_SELECTOR, ".book")
        if len(resultados) > 0:
            raise AssertionError("Error: Se encontraron resultados cuando no debería haberlos.")

        print("Buscando mensaje de 'No hay publicaciones que coincidan'...")
        mensaje_no_resultados = wait.until(EC.visibility_of_element_located((
            By.XPATH, "//*[contains(text(), 'No hay publicaciones que coincidan')]"
        )))
        print("Se mostró el mensaje de búsqueda sin resultados:", mensaje_no_resultados.text)

    except Exception as e:
        print("Error durante el test:", str(e))
    finally:
        print("Cerrando el navegador automáticamente...")
        driver.quit()

if __name__ == "__main__":
    test_busqueda_libro_sin_resultados()
