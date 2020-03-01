import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  loadedComponent: string = "recipe";

  onNavigate(component: string) {
    this.loadedComponent = component;
  }
}
