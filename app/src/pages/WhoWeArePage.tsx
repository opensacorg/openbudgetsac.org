export function WhoWeArePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h1>

      <div className="prose prose-gray max-w-none space-y-4">
        <p className="text-gray-700 leading-relaxed">
          Open Budget: Sacramento is a volunteer-built open-source project created by{' '}
          <a
            href="https://codeforsacramento.org"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Code for Sacramento
          </a>
          , a local civic tech brigade. Our goal is to make the City of Sacramento&apos;s budget
          data accessible and understandable to all residents.
        </p>

        <p className="text-gray-700 leading-relaxed">
          This project is a fork of{' '}
          <a
            href="https://openbudgetoakland.org/"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Budget: Oakland
          </a>
          , created by{' '}
          <a
            href="https://openoakland.org/"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenOakland
          </a>
          . We are grateful for their pioneering work in civic budget transparency.
        </p>

        <p className="text-gray-700 leading-relaxed">
          Budget data comes from the City of Sacramento&apos;s official approved budget
          documents, published annually. We parse and visualize this data to make it easier
          to understand where public money comes from and how it is spent.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Get Involved</h2>
        <p className="text-gray-700 leading-relaxed">
          We welcome contributors of all skill levels. Join us at{' '}
          <a
            href="https://www.meetup.com/Code4Sac/"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Code for Sacramento meetups
          </a>{' '}
          or contribute on{' '}
          <a
            href="https://github.com/code4sac/openbudgetsac.org/"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}
