new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
    eventDate: '',
    eventName: '',
    participants: '',
    totalAmount: 0,
    eventID: 1, // 初期値として適当な値を設定
    numberOfParticipants: 0,
    paymentFlag: false,
    calculationResult: null,
    eventHistory: []  // イベント履歴を格納する配列
  },
  methods: {
    async saveNomikaiEvent() {
      try {
        const requestData = {
          EventDate: this.eventDate,
          EventName: this.eventName,
          Participants: this.participants,
          Amount: this.totalAmount,
          PaymentFlag: this.paymentFlag
        };
        console.log('Request Data for saveNomikaiEvent:', requestData);

        const response = await fetch('https://m3h-beerkn-functionapp.azurewebsites.net/api/savenomikai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        });

        const responseBody = await response.text(); // テキストとしてレスポンスを取得
        console.log('Response Body for saveNomikaiEvent:', responseBody);

        if (!response.ok) {
          throw new Error(`Failed to save nomikai event: ${responseBody}`);
        }

        const data = JSON.parse(responseBody); // JSON としてパース
        alert(data.Message);
      } catch (error) {
        console.error('Error:', error.message); // エラーメッセージを表示
        alert('エラーが発生しました。飲み会イベントの保存に失敗しました。' + error.message);
      }
    },
    async calculate() {
      try {
        const requestData = {
          eventID: this.eventID,
          totalAmount: this.totalAmount,
          numberOfParticipants: this.numberOfParticipants
        };
        console.log('Request Data for calculate:', requestData);

        const response = await fetch('https://m3h-beerkn-functionapp.azurewebsites.net/api/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        });

        const responseBody = await response.text(); // テキストとしてレスポンスを取得
        console.log('Response Body for calculate:', responseBody);

        if (!response.ok) {
          throw new Error(`Failed to calculate: ${response.status} ${response.statusText} - ${responseBody}`);
        }

        this.calculationResult = JSON.parse(responseBody); // JSON としてパース
      } catch (error) {
        console.error('Error:', error.message); // エラーメッセージを表示
        alert('エラーが発生しました。計算に失敗しました。' + error.message);
      }
    },
    async getNomikaiEvent() {
      try {
        const eventId = this.eventID; 

        const response = await fetch(`https://m3h-beerkn-functionapp.azurewebsites.net/api/nomikai/${eventId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const responseBody = await response.text(); // テキストとしてレスポンスを取得
        console.log('Response Body for getNomikaiEvent:', responseBody);

        if (!response.ok) {
          throw new Error('Failed to fetch event history');
        }

        this.eventHistory = JSON.parse(responseBody); // JSON としてパース
      } catch (error) {
        console.error('Error:', error.message); // エラーメッセージを表示
        alert('エラーが発生しました。イベントの取得に失敗しました。' + error.message);
      }
    }
  }
});