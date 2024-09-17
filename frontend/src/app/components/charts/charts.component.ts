import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  barChart: any;
  doughnutChart: any;
  pieChart: any;

  constructor(private recipeService: RecipeService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.renderCharts();
  }

  renderCharts() {
    this.recipeService.getRecipeCategoryCount().subscribe({
      next: (response) => {
        const categories = response.data.map((item: any) => item.category);
        const counts = response.data.map((item: any) => item.count);

        this.createBarChart(categories, counts);
        this.createDoughnutChart(categories, counts);
        this.createPieChart(categories, counts);
      },
      error: (error) => {
        console.error('Error fetching recipe category count:', error);
      }
    });
  }

  createBarChart(categories: string[], counts: number[]) {
    const barChartCanvas = document.getElementById('barChart') as HTMLCanvasElement;
    this.barChart = new Chart(barChartCanvas, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Número de recetas',
          data: counts,
          backgroundColor: ['#e74c3c', '#1e90ff', '#fbbf24'],  // Colores de las barras según las categorías
          borderWidth: 1,
        }],
      },
      options: {
        layout: {
          padding: {
            top: 20,
            bottom: 20,
          },
        },
        scales: {
          x: {
            ticks: {
              color: 'white',  // Color del texto en el eje X
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: 'white',  // Color del texto en el eje Y
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: 'white',  // Color del texto de la leyenda
              font: {
                size: 14,  // Tamaño del texto de la leyenda
              },
              // Aquí se cambia el color del rectángulo al lado de "Número de recetas"
              generateLabels: (chart) => {
                const originalLabels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                return originalLabels.map(label => ({
                  ...label,
                  fillStyle: '#ffffff',  // Cambiamos el color del rectángulo de la leyenda a blanco
                }));
              }
            },
          },
        },
      },
    });
  }
  

  createDoughnutChart(categories: string[], counts: number[]) {
    const doughnutChartCanvas = document.getElementById('doughnutChart') as HTMLCanvasElement;
    this.doughnutChart = new Chart(doughnutChartCanvas, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [{
          label: 'Número de recetas',
          data: counts,
          backgroundColor: ['#e74c3c', '#1e90ff', '#fbbf24'],  // Cambia los colores si lo deseas
          borderWidth: 1,
        }],
      },
      options: {
        layout: {
          padding: {
            top: 20,
            bottom: 20,
          },
        },
        plugins: {
          legend: {
            labels: {
              color: 'white',  // Color del texto de la leyenda
            },
          },
        },
      },
    });
  }

  createPieChart(categories: string[], counts: number[]) {
    const pieChartCanvas = document.getElementById('pieChart') as HTMLCanvasElement;
    this.pieChart = new Chart(pieChartCanvas, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{
          label: 'Número de recetas',
          data: counts,
          backgroundColor: ['#e74c3c', '#1e90ff', '#fbbf24'],  // Cambia los colores si lo deseas
          borderWidth: 1,
        }],
      },
      options: {
        layout: {
          padding: {
            top: 20,
            bottom: 20,
          },
        },
        plugins: {
          legend: {
            labels: {
              color: 'white',  // Color del texto de la leyenda
            },
          },
        },
      },
    });
  }
}
