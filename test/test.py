from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

def test_localhost():
    # Configurar las opciones de Chrome
    chrome_options = Options()
    chrome_options.add_argument("--start-maximized")
    
    # Inicializar el driver de Chrome de manera más simple
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        # Navegar a localhost:4200
        driver.get("http://localhost:4200")
        
        # Esperar un momento para ver la página
        driver.implicitly_wait(5)
        # Esperar unos segundos antes de cerrar el navegador
        import time
        time.sleep(5)  # Esperar 5 segundos
        
    finally:
        # Cerrar el navegador
        driver.quit()

if __name__ == "__main__":
    test_localhost()
