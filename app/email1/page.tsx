export default function EnvyJetEmail() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4 text-sm text-gray-800">
      <div className="w-full max-w-3xl bg-white border border-gray-200">

        {/* Header info */}
        <div className="px-8 py-6 border-b">
          <p className="mb-2">
            <strong>EnvyJet Flight Enquiry:</strong> EJ-EF-0001
          </p>
        </div>

        <div className="px-8 py-4 border-b space-y-1">
          <p><strong>Expéditeur :</strong> EnvyJet (sales@envyjet.com)</p>
          <p><strong>À :</strong> fulgence.ikpe@yahoo.fr</p>
          <p><strong>Date :</strong> jeudi 2 mai 2024 à 11:27 UTC</p>
        </div>

        {/* Logo + menu */}
        <div className="px-8 py-6 flex items-center justify-between border-b">
          <img
            src="/images/logo_mobile.png"
            alt="EnvyJet"
            className="h-10"
          />
          <div className="flex gap-6 font-semibold text-blue-900 text-xs">
            <span>SHARED FLIGHTS</span>
            <span>EMPTY LEGS</span>
            <span>CONTACT US</span>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-8 space-y-4">

          <p>Dear <strong>Fulgence IKPE</strong>,</p>

          <p>
            Thank you, we have received your request to book an empty leg flight
          </p>

          <p>
            Your EnvyJet flight reference is: <strong>EJ-EF-0001</strong>
          </p>

          <p className="pt-4 font-semibold">Requested Flight Details:</p>

          <div className="pt-2">
            <p className="font-semibold">FLIGHT SUMMARY</p>

            <p className="mt-2">
              <strong>Leg 1:</strong> ABIDJAN FELIX HOUPHOUET INTL (ABJ) - BAMAKO SENOU (BKO)
            </p>

            <p>
              Departing (Local time): 15- May -2024 at 11:00 Hours
            </p>

            <p>
              Departure City: Abidjan
            </p>

            <p>
              Arrival Country: Bamako
            </p>
          </div>

          <hr className="my-6" />

          <div>
            <p className="font-semibold mb-2">Next steps:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>We'll call you to discuss the details of your flight</li>
              <li>Your request will be submitted to our approval process</li>
              <li>You will receive price confirmation shortly</li>
            </ul>
          </div>

          <p className="pt-4">
            If you have any questions, please contact us on +225 07 59 10 25 03 (24 hours) or you can access your account online:
          </p>

          <div className="pt-4">
            <button className="bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-800 hover:to-yellow-700 text-white font-semibold px-8 py-3">
              YOUR ENVYJET ACCOUNT
            </button>
          </div>

          <p className="pt-6">
            Kind regards
            <br />
            The EnvyJet Team
            <br />
            www.envyjet.com
          </p>

          <p className="text-xs text-gray-600 pt-6 border-t">
            We are available 24 hours a day, 7 days a week; e: sales@envyjet.com t: +225 07 59 10 25 03
            <br />
            Prices are subject to availability and correct at time of sending. All details provided by you will be held by EnvyJet Sarl and used in accordance with our Privacy Policy and Terms & Conditions.
          </p>

        </div>
      </div>
    </div>
  );
}
