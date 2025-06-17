import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user/User';
import { Router } from '@angular/router';
import { NewUserService } from '../services/newUserService/new-user.service';


@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent {

  constructor(
    private userService: NewUserService, 
    private router: Router
  ) {}


 myPayloadUser = new User();
 myNewUser = new User();

 confirmData: boolean = false;
 
createUser() {
  this.userService.signUp(this.myPayloadUser).subscribe({
    next: (response) => {
      console.log("Usuario creado exitosamente:", response);
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error("Error al crear el usuario:", err);
    }
  });
}
}

 //createUser() {
   //console.log(this.myPayloadUser);

 //this.myNewUser = this.userService.createUser(
   //     this.myPayloadUser
     //  );

 //console.log(this.myNewUser);

 //if (this.myNewUser.id != 0)
  //      this.router.navigate(['/login']);

 //}

//}
