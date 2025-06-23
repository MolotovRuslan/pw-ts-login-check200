import { Page } from '@playwright/test'; //  playwright type object
import Class from './basePage';

class LoginPage { //  encapsulation 

    private page: Page; // declaration of a private class field, work only inside of this class

    constructor(page: Page) {
        this.page = page; // this - is the current class object, allowing you to access its properties and methods within the class.
    }
    
  

    get loginInputUsername() {
        return this.page.locator('#username');
    }
    
    get loginInputPassword() {
        return this.page.locator('#password');
    }
    
    get loginBtnSubmit() {
        return this.page.locator('button[type="submit"]');
    }
    
    async login(username: string, password: string) { // In TypeScript, we need to declare the data types of function parameters for type safety and better code completion.
    await this.loginInputUsername.fill(username);
    await this.loginInputPassword.fill(password);
    await this.loginBtnSubmit.click();
    }

    get loginRedFlashAlert() {
        return this.page.locator('#flash');
    }

    
    
}

export default LoginPage;