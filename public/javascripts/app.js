import Controller from "./controller.js"
import Model from "./model.js"
import View from "./view.js"

class App {
  constructor() {
    this.view = new View();
    this.model = new Model();
    this.Controller = new Controller(this.model, this.view);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
})