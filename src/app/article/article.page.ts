import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { flipAnimation } from 'src/app/animations/flipinout';

@Component({
  selector: 'app-article',
  templateUrl: './article.page.html',
  styleUrls: ['./article.page.scss'], 
  animations: [flipAnimation]
})
export class ArticlePage implements OnInit {
  @HostBinding('@flipAnimation') pageTransitions = true;
  
  articleId: number | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.queryParams.subscribe((params) => {
      this.articleId = params['id'] ? parseInt(params['id'], 10) : null;
    });
  }

  

}
