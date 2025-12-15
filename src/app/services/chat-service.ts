import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
constructor(private http: HttpClient) {}

  private chatUrl = environment.apiUrl+environment.endpoints.chat; // ✅ ton endpoint Spring
   sendMessage(message: string): Observable<string> {
    return this.http.post(this.chatUrl, { message }, {
      responseType: 'text' // car Spring renvoie TEXT_PLAIN
    });
  }
}
