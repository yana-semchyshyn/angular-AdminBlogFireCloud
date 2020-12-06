import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBlog } from 'src/app/shared/interfaces/blog.interface';
import { BlogService } from 'src/app/shared/services/blog.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {
  blog: IBlog;
  constructor(private ActivatedRoute: ActivatedRoute, private blogService: BlogService, public location: Location) { }

  ngOnInit(): void {
    this.getBlog();
  }

  private getBlog(): void{
    const id = this.ActivatedRoute.snapshot.paramMap.get('id');
    this.blogService.getBlog(id).subscribe(data => this.blog = data.data());
  }
}