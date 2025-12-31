import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements AfterViewInit {

  // Transaction History Data
  transactions = [
    { platform: 'Amazon', icon: 'shopping_bag', date: '03 March, 2025', amount: '-$750.00', status: 'Complete', type: 'Online Purchase' },
    { platform: 'Netflix', icon: 'play_circle', date: '01 March, 2025', amount: '-$15.99', status: 'Complete', type: 'Subscription' },
    { platform: 'Salary', icon: 'account_balance', date: '28 Feb, 2025', amount: '+$4,500.00', status: 'Complete', type: 'Income' },
    { platform: 'Uber', icon: 'local_taxi', date: '25 Feb, 2025', amount: '-$23.50', status: 'Pending', type: 'Transport' }
  ];

  ngAfterViewInit(): void {
    this.initBalanceChart();
    this.initSavingsDonut();
  }

  initBalanceChart() {
    const ctx = document.getElementById('balanceChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Balance',
          data: [6500, 7200, 6800, 7500, 6200, 7800, 9500, 8200, 5800, 6100, 5200, 4800],
          backgroundColor: (context) => {
            return context.dataIndex === 6 ? '#1A3636' : '#E8EEEE';
          },
          borderRadius: 6,
          borderSkipped: false,
          barThickness: 28
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1A3636',
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 11 },
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (item) => `$${(item.parsed.y ?? 0).toLocaleString()} (20%)`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#9CA3AF', font: { size: 11 } }
          },
          y: {
            grid: { color: '#F3F4F6' },
            ticks: {
              color: '#9CA3AF',
              font: { size: 11 },
              callback: (value) => '$' + Number(value).toLocaleString()
            }
          }
        }
      }
    });
  }

  initSavingsDonut() {
    const ctx = document.getElementById('savingsDonut') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Home', 'Emergency', 'Vacation'],
        datasets: [{
          data: [15000, 7500, 500],
          backgroundColor: ['#1A3636', '#F59E0B', '#84CC16'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '75%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1A3636',
            callbacks: {
              label: (item) => `₹${item.parsed.toLocaleString()}`
            }
          }
        }
      }
    });
  }
}
