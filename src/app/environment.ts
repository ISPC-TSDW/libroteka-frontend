export const environment = {
    apiUrl: (() => {
        const frontendUrl = window.location.href;

        if (frontendUrl.includes('onrender.com')) {
            return 'https://libroteka-app.onrender.com';
        } else if (frontendUrl.includes('koyeb')) {
            return 'http://libroback.koyeb.app';
        } else {
            return 'http://127.0.0.1:8000';
        }
    })()
};