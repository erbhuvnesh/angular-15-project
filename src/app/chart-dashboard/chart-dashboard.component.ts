import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ChartFormComponent } from '../chart-form/chart-form.component';

@Component({
  selector: 'app-chart-dashboard',
  templateUrl: './chart-dashboard.component.html',
  styleUrls: ['./chart-dashboard.component.scss']
})
export class ChartDashboardComponent implements OnInit {
  charts: any[] = [];

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCharts();
  }

  loadCharts() {
    this.http.get('http://localhost:3000/charts').subscribe((charts: any[]) => {
      this.charts = charts;
    });
  }

  openAddChartDialog() {
    const dialogRef = this.dialog.open(ChartFormComponent, {
      width: '500px',
      data: { chart: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadCharts();
    });
  }

  openEditChartDialog(chart: any) {
    const dialogRef = this.dialog.open(ChartFormComponent, {
      width: '500px',
      data: { chart }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadCharts();
    });
  }
}
