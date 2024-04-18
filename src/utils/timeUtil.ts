export default class TimeUtil {
  private date: Date;
  private timeStemp: number;
  constructor() {
    this.date = new Date();
    this.timeStemp = this.date.getTime();
  }

  public getNowTimeStemp = (): number => {
    return this.timeStemp;
  };

  public getNowTimeString = (): string => {
    const date: Date = this.date;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    let timeString: string = "";
    timeString += `${year}-`;
    timeString += `${month}-`;
    timeString += `${day > 9 ? day : "0" + day} `;
    timeString += `${hour > 9 ? hour : "0" + hour}:`;
    timeString += `${minute > 9 ? minute : "0" + minute}:`;
    timeString += `${second > 9 ? second : "0" + second}`;
    return timeString;
  };
}
