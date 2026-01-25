import axios from "axios";
import { serverApi } from "../../lib/config";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../../lib/types/member";
import { METHODS } from "http";

class MemberService {
  private readonly path: string;
  constructor() {
    this.path = serverApi;
  }


  public async getRestaurant(): Promise<Member> {
    try {
      let url = this.path + "/member/restaurant";
      const result = await axios.get(url);
      console.log("getRestaurant:", result);

      return result.data;
    } catch (err) {
      console.log("MemberService - getRestaurant error:", err);
      throw err;
    }
  }

  public async signup(input: MemberInput): Promise<Member> {
    try {
      let url = this.path + "/member/signUp";
      const result = await axios.post(url, input, { withCredentials: true });
      console.log("signup:", result);
      const member: Member = result.data as Member;
      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err) {
      console.log("MemberService - signup error:", err);
      throw err;
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    try {
      let url = this.path + "/member/login";
      const result = await axios.post(url, input, { withCredentials: true });
      console.log("signup:", result);
      const member: Member = result.data as Member;
      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err) {
      console.log("MemberService - signup error:", err);
      throw err;
    }
  }

  public async logout(): Promise<boolean> {
    try {
      let url = this.path + "/member/logout";
      const result = await axios.post(url, {}, { withCredentials: true });
      localStorage.removeItem("memberData");
      console.log("logout:", result);
      return result.data.logout;
    } catch (err) {
      console.log("MemberService - logout error:", err);
      throw err;
    }
  }

  public async updateMember(input: MemberUpdateInput): Promise<Member> {
    try {
      const formData = new FormData();
      formData.append("memberNick", input.memberNick || "");
      formData.append("memberPhone", input.memberPhone || "");
      formData.append("memberDesc", input.memberDesc || "");
      formData.append("memberAddress", input.memberAddress || "");
      formData.append("memberImg",input.memberImg || "");
      const result = await axios(`${serverApi}/member/update`, {
        method: "POST",
        withCredentials: true,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("update member",result);
      const member:Member = result.data
      localStorage.setItem("memberData",JSON.stringify(member));
      return member
      
    } catch (err) {
      console.log("MemberService - logout error:", err);
      throw err;
    }
  }
}

export default MemberService;
