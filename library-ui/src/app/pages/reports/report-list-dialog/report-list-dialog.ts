import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-report-list-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatTableModule, MatButtonModule],

  template: `
    <h2 mat-dialog-title class="dialog-title">{{ data.title }}</h2>
    
    <mat-dialog-content class="custom-dialog-content">
      <table mat-table [dataSource]="data.list" class="mat-elevation-z0 dialog-table">
        
        <ng-container matColumnDef="borrowerName">
          <th mat-header-cell *matHeaderCellDef> Người mượn </th>
          <td mat-cell *matCellDef="let element"> 
            <strong class="borrower-name">{{ element.borrower_name || element.borrowerName }}</strong> 
          </td>
        </ng-container>

        <ng-container matColumnDef="bookTitle">
          <th mat-header-cell *matHeaderCellDef> Tên sách </th>
          <td mat-cell *matCellDef="let element"> 
            {{ element.book_title || element.bookTitle || 'N/A' }} 
          </td>
        </ng-container>

        <ng-container matColumnDef="borrowDate">
          <th mat-header-cell *matHeaderCellDef> Ngày mượn </th>
          <td mat-cell *matCellDef="let element"> 
            {{ (element.borrow_date || element.borrowDate) | date:'dd/MM/yyyy' }} 
          </td>
        </ng-container>

        <ng-container matColumnDef="dueDate">
          <th mat-header-cell *matHeaderCellDef> Hạn trả </th>
          <td mat-cell *matCellDef="let element"> 
            {{ (element.due_date || element.dueDate) | date:'dd/MM/yyyy' }} 
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <div *ngIf="data.list.length === 0" class="no-data-msg">
        Không có dữ liệu hiển thị.
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-flat-button color="primary" mat-dialog-close>Đóng</button>
    </mat-dialog-actions>
  `,
  styleUrl: './report-list-dialog.css' 
})
export class ReportListDialogComponent {
  displayedColumns: string[] = ['borrowerName', 'bookTitle', 'borrowDate', 'dueDate'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string, list: any[] }
  ) {}
}