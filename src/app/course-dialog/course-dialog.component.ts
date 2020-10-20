import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../model/course';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Store } from '../common/store.service';
import { concatMap, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

  form: FormGroup;

  course: Course;

  @ViewChild('saveButton', {static: true}) saveButton: ElementRef;

  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private store: Store) {

    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required]
    });

  }

  ngOnInit() {
    this.form.valueChanges
      .pipe(
        filter(() => this.form.valid),
        concatMap(changes => this.store.saveCourse(this.course.id, changes))
      )
      .subscribe();
  }

  save() {
    this.store.saveCourse(this.course.id, this.form.value)
      .subscribe(
        () => this.close(),
        err => console.log('Error saving course', err)
      );
  }


  close() {
    this.dialogRef.close();
  }


}
