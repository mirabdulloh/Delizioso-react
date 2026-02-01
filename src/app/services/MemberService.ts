import axios from "axios";
import { serverApi } from "../../lib/config";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../../lib/types/member";

class MemberService {
  private readonly path: string;
  constructor() {
    this.path = serverApi;
  }

  private extractMember(data: any): Member {
    const member: any = data?.member ?? data;
    if (member && !member.memberAddress && member.memberAdress) {
      member.memberAddress = member.memberAdress;
    }
    return member as Member;
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
      const member: Member = this.extractMember(result.data);
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
      console.log("login:", result);
      const member: Member = this.extractMember(result.data);
      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err) {
      console.log("MemberService - login error:", err);
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
      formData.append("memberAdress", input.memberAddress || "");
      
      // Only append memberImg if it's a File object
      if (input.memberImage instanceof File) {
        formData.append("memberImg", input.memberImage);
        console.log("Uploading image file:", input.memberImage.name);
      }
      
      formData.append("memberEmail", input.memberEmail || "");
      const result = await axios(`${serverApi}/member/update`, {
        method: "POST",
        withCredentials: true,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("update member", result);
      const member: Member = this.extractMember(result.data);
      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err) {
      console.log("MemberService - updateMember error:", err);
      throw err;
    }
  }

  public async getMemberDetail(): Promise<Member> {
    try {
      const url = this.path + "/member/detail";
      const result = await axios.get(url, { withCredentials: true });
      console.log("getMemberDetail:", result);
      const member: Member = this.extractMember(result.data);
      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err) {
      console.log("MemberService - getMemberDetail error:", err);
      throw err;
    }
  }
  public async validateCoupon(couponCode: string): Promise<{ valid: boolean; discount: number; message?: string }> {
    try {
      const url = this.path + "/member/validate-coupon";
      const result = await axios.post(url, { couponCode }, { withCredentials: true });
      console.log("validateCoupon:", result);
      return result.data;
    } catch (err) {
      console.log("MemberService - validateCoupon error:", err);
      throw err;
    }
  }

  public async useCoupon(couponCode: string): Promise<Member> {
    try {
      const url = this.path + "/member/use-coupon";
      const result = await axios.post(url, { couponCode }, { withCredentials: true });
      console.log("useCoupon:", result);
      const member: Member = this.extractMember(result.data);
      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err) {
      console.log("MemberService - useCoupon error:", err);
      throw err;
    }
  }
}

export default MemberService;
