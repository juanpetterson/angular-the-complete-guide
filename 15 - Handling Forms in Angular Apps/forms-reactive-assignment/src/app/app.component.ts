import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  projectStatus = ['Stable', 'Critical', 'Finished'];
  projectForm: FormGroup;
  forbiddenNames = ['Test'];
  defaultStatus = 'stable';
  submitted = false;
  project = {
    name: '',
    email: '',
    status: ''
  };

  ngOnInit() {
    this.projectForm = new FormGroup({
      name: new FormControl(
        null,
        [Validators.required],
        this.forbiddenNameAsync.bind(this)
      ),
      email: new FormControl(null, [Validators.required, Validators.email]),
      status: new FormControl(null)
    });

    this.projectForm.statusChanges.subscribe(status => console.log(status));
  }

  onSubmit() {
    console.log(this.projectForm.value);
    this.submitted = true;
    this.project.name = this.projectForm.value.name;
    this.project.email = this.projectForm.value.email;
    this.project.status = this.projectForm.value.status;
  }

  forbiddenName(control: FormControl): { [s: string]: boolean } {
    if (this.forbiddenNames.indexOf(control.value) !== -1) {
      return { nameIsForbidden: true };
    }

    return null;
  }

  forbiddenNameAsync(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'Test') {
          return resolve({ nameIsForbidden: true });
        } else {
          resolve(null);
        }
      }, 1000);
    });

    return promise;
  }
}
