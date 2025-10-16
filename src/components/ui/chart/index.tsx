import React from 'react'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

interface ChartComponentProps {
  chartData: string | null
}

interface ChartConfig {
  chart: {
    type:
      | 'line'
      | 'area'
      | 'bar'
      | 'pie'
      | 'donut'
      | 'radialBar'
      | 'scatter'
      | 'bubble'
      | 'heatmap'
      | 'candlestick'
      | 'boxPlot'
      | 'radar'
      | 'polarArea'
      | 'rangeBar'
      | 'rangeArea'
      | 'treemap'
    height?: number
    [key: string]: any
  }
  series: any[]
  xaxis?: any
  yaxis?: any
  title?: {
    text: string
    [key: string]: any
  }
  [key: string]: any
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
  chartData
}) => {
  if (!chartData) {
    return null
  }

  try {
    const config: ChartConfig = JSON.parse(chartData)

    // Função para detectar se os dados são monetários
    const isMonetaryData = (): boolean => {
      // Verifica se há palavras-chave monetárias no título ou labels
      const monetaryKeywords = [
        'valor',
        'preço',
        'custo',
        'receita',
        'faturamento',
        'lucro',
        'vendas',
        'real',
        'reais',
        'R$',
        'BRL'
      ]
      const textToCheck = [
        config.title?.text || '',
        config.xaxis?.title?.text || '',
        config.yaxis?.title?.text || '',
        ...(config.series?.map((s: any) => s.name || '') || [])
      ]
        .join(' ')
        .toLowerCase()

      return monetaryKeywords.some((keyword) =>
        textToCheck.includes(keyword.toLowerCase())
      )
    }

    // Formatação monetária brasileira
    const formatBRL = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    }

    // Configurações padrão do ApexCharts
    const defaultOptions: ApexOptions = {
      chart: {
        type: config.chart.type,
        height: config.chart.height || 450, // Aumentado de 350 para 450
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false
          }
        },
        background: 'transparent'
      },
      theme: {
        mode: 'light'
      },
      colors: [
        '#1f77b4',
        '#ff7f0e',
        '#2ca02c',
        '#d62728',
        '#9467bd',
        '#8c564b',
        '#e377c2',
        '#7f7f7f',
        '#bcbd22',
        '#17becf'
      ],
      dataLabels: {
        enabled: false,
        formatter: function (val: number) {
          return isMonetaryData() ? formatBRL(val) : val.toString()
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      grid: {
        borderColor: '#e0e0e0',
        strokeDashArray: 3
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left'
      },
      yaxis: {
        labels: {
          formatter: function (val: number) {
            return isMonetaryData() ? formatBRL(val) : val.toString()
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return isMonetaryData() ? formatBRL(val) : val.toString()
          }
        }
      }
    }

    // Merge das configurações personalizadas com as padrão
    const options: ApexOptions = {
      ...defaultOptions,
      ...config,
      chart: {
        ...defaultOptions.chart,
        ...config.chart
      }
    }

    // Remove a propriedade series das options (será passada separadamente)
    const { series, ...finalOptions } = options

    return (
      <div className="w-full h-full">
        <Chart
          options={finalOptions}
          series={config.series}
          type={config.chart.type}
          height={config.chart.height || 450}
        />
      </div>
    )
  } catch (error) {
    console.error('Erro ao renderizar gráfico:', error)
    return null
  }
}

export default ChartComponent
