  import { Component, OnInit } from '@angular/core';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { MediumService } from 'src/app/services/medium.service';
  import { Medium } from 'src/app/models/medium';
  import { Router } from '@angular/router';
  import { CitizenService } from 'src/app/services/citizen.service';
import { ModalController } from '@ionic/angular';

  @Component({
    selector: 'app-add-evidence',
    templateUrl: './add-evidence.page.html',
    styleUrls: ['./add-evidence.page.scss'],
  })
  export class AddEvidencePage implements OnInit {
    evidence: Medium = {
      mediaId: 0,
      reportId: 0,
      filename: '',
      description: '',
      crimeId: 0,
      contentType: '',
      content: new Uint8Array()
    };

    evidences: any[] = [];
    citizenId: number = 0;
    reportId: number = 0;
    isModalOpen = false; 
    currentStep = 1;

    constructor(
      private http: HttpClient,
      private mediaService: MediumService,
      private citizenService: CitizenService,
      private router: Router,
      private modalController: ModalController
    ) {}

    ngOnInit(): void {
      

      const navigation = this.router.getCurrentNavigation();
          const state = navigation?.extras.state as { reportId: number, citizenId: number };

          if (state) {

            console.log('Report ID:', state.reportId);
            this.reportId = state.reportId;
          }

          const userData = sessionStorage.getItem('userData');
          if (userData) {
              const { personId } = JSON.parse(userData);
              this.citizenService.getCitizens().subscribe(
                  (citizens) => {
                      const citizen = citizens.find((c: { person_id: any; }) => c.person_id === personId); 
                      if (citizen) {
                          this.citizenId = citizen.citizen_id; 
                          console.log('Retrieved citizenId:', citizen.citizen_id);
                          console.log('Retrieved citizens', citizens)
                      } else {
                          console.error('Citizen not found for personId:', personId);
                          console.log('Retrieved citizens', citizens)
                      }
                  },
                  error => {
                      console.error('Error retrieving citizens:', error);
                  }
              );
          }
    }


    addEvidence() {
      this.evidences.push(
        { 
          content: '',
          contentType: '', 
          description: '', 
          extension: '',
          filename: '',
          file: null,
        });
    }

    removeEvidence(index: number) {
      this.evidences.splice(index, 1);
    }

    onFileSelected(event: any, index: number) {

      
      const file = event.target.files[0];
      const desc = this.evidence.description
      if (file) {
          // Convert the file to a byte array and get the MIME type
          const reader = new FileReader();
          reader.onload = (e) => {
              const byteArray = new Uint8Array(reader.result as ArrayBuffer);
              const mimeType = file.type;

              this.evidences[index].file = byteArray; 
              this.evidences[index].contentType = mimeType;
              this.evidences[index].filename = file.name;
              this.evidences[index].description = this.evidences[index].description || '';
              this.evidences[index].extension = mimeType.split('/')[1];
          };
          reader.readAsArrayBuffer(file); 
      }
  }

    isFilesUploaded(): boolean {
      return this.evidences.every((evidence) => evidence.file);
    }

    submitEvidences() {
      const formData = new FormData();
      const crimeId = null; 

      this.evidences.forEach((evidence, index) => {
          if (evidence.file) {
              // Append the byte array as a Blob
              // const fileBlob = new Blob([evidence.file], { type: evidence.contentType });
              const fileWithMeta = new File([evidence.file], evidence.filename, { type: evidence.contentType });
              formData.append(`items[${index}].File`, fileWithMeta);
              formData.append(`items[${index}].content_type`, evidence.contentType);
              formData.append(`items[${index}].description`, evidence.description);
              formData.append(`items[${index}].filename`, evidence.filename);
              formData.append(`items[${index}].extension`, evidence.extension);
              formData.append(`items[${index}].report_id`, this.reportId.toString());
              // formData.append(`items[${index}].crime_id`, crimeId.toString());
          }
      });

      this.mediaService.uploadItems(formData, this.reportId).subscribe(
          (response) => {
            console.log('Evidences Data:', this.evidences);
              console.log('Evidences uploaded successfully:', response);
              this.openModal();
          },
          (error) => {
            console.log('Evidences Data:', formData);
              console.error('Error uploading evidences:', error);
          }
      );
  }

  openModal() {
   this.isModalOpen = true;
  }
  
  closeModal() {
    this.modalController.dismiss();
    this.resetSteps(); 
    this.isModalOpen = false;
  }
  
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }


  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

 
  private resetSteps() {

    this.currentStep = 1;
  }


  proceedToReport() {
    console.log('Proceeding to report...');

    this.modalController.dismiss();
    this.router.navigate(['/payment'], {
      state: {
    
        citizenId: this.citizenId,
        reportId: this.reportId,
      },
    });
   
  }


    
    
  }
