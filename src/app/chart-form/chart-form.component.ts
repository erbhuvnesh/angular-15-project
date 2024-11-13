import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

const CHART_TYPES = ['line', 'bar', 'doughnut', 'pie', 'bubble'];
const CHART_OPTIONS = {
  line: [{ name: 'borderColor', label: 'Border Color', type: 'color' }],
  bar: [{ name: 'backgroundColor', label: 'Background Color', type: 'color' }],
  doughnut: [{ name: 'backgroundColor', label: 'Background Color', type: 'color' }],
  pie: [{ name: 'backgroundColor', label: 'Background Color', type: 'color' }],
  bubble: [{ name: 'borderColor', label: 'Border Color', type: 'color' }]
};

@Component({
  selector: 'app-chart-form',
  templateUrl: './chart-form.component.html'
})
export class ChartFormComponent implements OnInit {
  chartForm: FormGroup;
  chartTypes = CHART_TYPES;
  dynamicFields: any[] = [];
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<ChartFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.chartForm = this.fb.group({
      type: ['', Validators.required],
      title: ['', Validators.required],
      labels: ['', Validators.required],
      data: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.chart) {
      this.isEditMode = true;
      this.loadChartData(this.data.chart);
    }
  }

  loadChartData(chart: any) {
    this.chartForm.patchValue(chart);
    this.onChartTypeChange(chart.type);
    Object.keys(chart.options).forEach(option => {
      if (this.chartForm.controls[option]) {
        this.chartForm.controls[option].setValue(chart.options[option]);
      }
    });
  }

  onChartTypeChange(type: string) {
    this.dynamicFields = CHART_OPTIONS[type] || [];

    Object.keys(this.chartForm.controls).forEach(control => {
      if (!['type', 'title', 'labels', 'data'].includes(control)) {
        this.chartForm.removeControl(control);
      }
    });

    this.dynamicFields.forEach(field => {
      const control = new FormControl('', field.type === 'checkbox' ? [] : Validators.required);
      this.chartForm.addControl(field.name, control);
    });
  }

  onSubmit() {
    if (this.chartForm.valid) {
      const chartData = {
        type: this.chartForm.value.type,
        title: this.chartForm.value.title,
        labels: this.chartForm.value.labels.split(','),
        data: this.chartForm.value.data.split(',').map(Number),
        options: {}
      };

      this.dynamicFields.forEach(field => {
        chartData.options[field.name] = this.chartForm.value[field.name];
      });

      if (this.isEditMode) {
        this.http.put(`http://localhost:3000/charts/${this.data.chart.id}`, chartData)
          .subscribe(() => this.dialogRef.close(true));
      } else {
        this.http.post('http://localhost:3000/charts', chartData)
          .subscribe(() => this.dialogRef.close(true));
      }
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
