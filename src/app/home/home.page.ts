import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AccountService } from '../services/account.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Person } from '../models/person';
import { CreateAccountData } from '../models/create-account-data';
import { LoginService } from '../services/login.service';
import { PersonService } from '../services/person.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

  personData: Person = {
    personId: 0,
    firstname: '',
    middlename: '',
    lastname: '',
    sex: '',
    birthdate: '',
    civilStatus: '',
    bioStatus: true,
  };
 
  accountData: CreateAccountData = {
    email: '',
    password: '',
    telNum: '',
    contactNum: '',
    homeAddressId: 0,
    workAddressId: 0,
    role: 'user',
    personId: 0,
    profile_pic: new Uint16Array
  };

  avatarUrl: string = 'assets/user-default.jpg';

  personId: number = 0;
  constructor(
    private menu: MenuController,
    private loginService: LoginService,
    private accountService: AccountService,
    private personService: PersonService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadUserProfile();
    });
  }
  
  ngAfterViewInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
        const userData = navigation.extras.state['userData'];
        if (userData) {
            this.loadUserProfile(); 
        }
    }
}

  ngOnInit() {

    this.loadUserProfile();
    this.cdr.detectChanges();
    
  }
  


  loadUserProfile() {
    setTimeout(() => {
      const userData = sessionStorage.getItem('userData');
      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          this.personData = {
            personId: parsedData.personId || 0,
            firstname: this.capitalizeWords(parsedData.first_name || ''),
            middlename: parsedData.middle_name || '',
            lastname: this.capitalizeWords(parsedData.last_name || ''),
            sex: '',
            birthdate: '',
            civilStatus: '',
            bioStatus: true,
          };

          this.accountData = {
            email: parsedData.email || '',
            password: '',
            telNum: '',
            contactNum: '',
            homeAddressId: 0,
            workAddressId: 0,
            role: '',
            personId: parsedData.personId || 0,
            profile_pic: new Uint16Array(),
          };

        
          // console.log('Person Data from Session:', this.personData);
          // console.log('Account Data from Session:', this.accountData);
        } catch (e) {
          console.error('Failed to parse userData from session:', e);
        }
      } else {
        console.log('No userData found in session storage.');
      }
    }, 100);
  }

  resetUserData() {
    
    this.personData = {
      personId: 0,
      firstname: '',
      middlename: '',
      lastname: '',
      sex: '',
      birthdate: '',
      civilStatus: '',
      bioStatus: true,
    };
 
    this.accountData = {
      email: '',
      password: '',
      telNum: '',
      contactNum: '',
      homeAddressId: 0,
      workAddressId: 0,
      role: 'user',
      personId: 0,
      profile_pic: new Uint16Array
    };
  }

  capitalizeWords(string: string): string {
    return string
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }


  disableScroll() {
    document.body.classList.add('no-scroll');
  }

  enableScroll() {
    document.body.classList.remove('no-scroll');
  }

  logout() {
    this.loginService.signOut().subscribe(
      (response) => {
        console.log('Signed out successfully:', response);
        this.clearSession();
        localStorage.setItem('authenticated', '0');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error during sign out:', error);
      }
    );
  } 

  clearSession() {
    sessionStorage.removeItem('userData');
    localStorage.removeItem('sessionData');
    this.resetUserData();
    localStorage.clear();
    sessionStorage.clear();

  }

  editProfile(personId: number) {
      
      // console.log("Navigating to edit profile edit with person id:", personId);
      this.router.navigate(['tabs/home/edit-profile']);
  }

}
