import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule {}
