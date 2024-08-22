import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CrimeAnalysisModalComponent } from './crime-analysis-modal.component';

describe('CrimeAnalysisModalComponent', () => {
  let component: CrimeAnalysisModalComponent;
  let fixture: ComponentFixture<CrimeAnalysisModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CrimeAnalysisModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CrimeAnalysisModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
