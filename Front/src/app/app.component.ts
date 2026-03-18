import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  URL_FRONT = environment.URL_FRONT;
  path = window.location.pathname;
  pageName = this.path.split("/").pop();
}
